'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Comunicado } from '@/lib/data/mock-store';
import { 
  Bell, 
  MessageSquare, 
  Send, 
  Plus, 
  Calendar, 
  Users, 
  Eye, 
  X,
  Share2,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function PortalPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>(() => MockDataStore.getComunicados());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Comunicado['categoria']>('Geral');
  const [conteudo, setConteudo] = useState('');
  const [destinatarios, setDestinatarios] = useState('Todos os Encarregados');
  const [autor, setAutor] = useState('Direcção Pedagógica');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) {
      toast.error('Preencha o título e o conteúdo do comunicado.');
      return;
    }

    MockDataStore.addComunicado({
      titulo,
      categoria,
      conteudo,
      destinatarios,
      autor,
      data: new Date().toISOString().split('T')[0]
    });

    setComunicados([...MockDataStore.getComunicados()]);
    toast.success('Comunicado publicado no Portal dos Encarregados!');
    setIsModalOpen(false);
  };

  const handleWhatsAppBroadcast = (com: Comunicado) => {
    const text = `📢 *COMUNICADO OFICIAL - ESCOLA NEXUS*\n\n*${com.titulo}*\n_Publicado por: ${com.autor} em ${com.data}_\n\n${com.conteudo}\n\n_Para mais informações consulte a Secretaria ou o Portal NEXUS._`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Mensagem formatada para partilha via WhatsApp!');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Comunicação • Portal de Encarregados de Educação" 
        description="Mural de avisos institucionais, circulares pedagógicas e transmissão de comunicados para famílias."
        actionLabel="Novo Comunicado"
        onAction={() => {
          setTitulo('');
          setConteudo('');
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Wall of Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {comunicados.map((com) => (
            <div key={com.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    com.categoria === 'Urgente' ? 'bg-red-50 text-red-700 border border-red-200' :
                    com.categoria === 'Académico' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    com.categoria === 'Financeiro' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {com.categoria}
                  </span>
                  <span className="text-xs text-slate-400">• {com.data}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-slate-400" /> {com.destinatarios}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-slate-400" /> {com.visualizacoes}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{com.titulo}</h3>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">{com.conteudo}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Emitido por: <strong className="text-slate-800">{com.autor}</strong>
                </span>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleWhatsAppBroadcast(com)}
                  className="border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs shadow-sm"
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Partilhar no WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: Fast channel stats and info */}
        <div className="space-y-6">
          <div className="bg-primary-950 text-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-accent-400">
                <Bell size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base">Canais de Difusão</h3>
                <p className="text-xs text-slate-300">Moçambique SMS & WhatsApp</p>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Os comunicados publicados no mural escolar são sincronizados automaticamente com o portal web dos encarregados e podem ser enviados em lote via WhatsApp com um único clique.
            </p>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Encarregados Registados:</span>
                <span className="font-bold text-white">1.250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Contactos com WhatsApp (+258):</span>
                <span className="font-bold text-emerald-400">98.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Taxa Média de Leitura:</span>
                <span className="font-bold text-white">94% em 2 horas</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Boas Práticas de Comunicação</h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Mantenha comunicados urgentes breves e objectivos.</li>
              <li>Indique sempre as datas limite e canais de resposta oficiais.</li>
              <li>Para assuntos financeiros, mencione a conta bancária ou M-Pesa oficial da instituição.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Novo Comunicado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Publicar Novo Comunicado</h3>
                  <p className="text-xs text-slate-500">Enviar aviso geral ou circular pedagógica</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="com-titulo">Título do Comunicado *</Label>
                <Input 
                  id="com-titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Convocatória para Reunião Geral de Encarregados"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Categoria</Label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Académico">Académico</option>
                    <option value="Financeiro">Financeiro</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Público Alvo</Label>
                  <select
                    value={destinatarios}
                    onChange={(e) => setDestinatarios(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Todos os Encarregados">Todos os Encarregados</option>
                    <option value="Ensino Pré-escolar">Ensino Pré-escolar</option>
                    <option value="Ensino Primário (1ª a 6ª)">Ensino Primário (1ª a 6ª)</option>
                    <option value="Ensino Secundário (7ª a 12ª)">Ensino Secundário (7ª a 12ª)</option>
                    <option value="Classes com Exame (10ª e 12ª)">Classes com Exame (10ª e 12ª)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="com-conteudo">Conteúdo da Mensagem *</Label>
                <textarea
                  id="com-conteudo"
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={4}
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                  placeholder="Escreva aqui os detalhes, orientações, datas e horários..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="com-autor">Assinatura / Autor</Label>
                <Input 
                  id="com-autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Publicar Comunicado
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
