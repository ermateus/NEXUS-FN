'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Matricula } from '@/lib/data/mock-store';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileCheck, 
  MessageCircle, 
  Phone, 
  Plus, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>(() => MockDataStore.getMatriculas());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [alunoNome, setAlunoNome] = useState('');
  const [classe, setClasse] = useState('10ª Classe');
  const [tipo, setTipo] = useState<'Nova Matrícula' | 'Renovação'>('Nova Matrícula');
  const [valor, setValor] = useState(2500);
  const [contacto, setContacto] = useState('+25884');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+258')) {
      val = '+258' + val.replace(/^\+?258?/, '');
    }
    const cleanNumbers = val.substring(4).replace(/\D/g, '').slice(0, 9);
    setContacto(`+258${cleanNumbers}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoNome.trim()) {
      toast.error('Indique o nome do aluno.');
      return;
    }

    MockDataStore.addMatricula({
      alunoNome,
      classe,
      anoLectivo: 2026,
      dataMatricula: new Date().toISOString().split('T')[0],
      tipo,
      valor: Number(valor) || 2000,
      estado: 'Confirmada',
      contacto
    });

    setMatriculas([...MockDataStore.getMatriculas()]);
    toast.success(`Matrícula de ${alunoNome} registada com sucesso!`);
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: string, novoEstado: 'Confirmada' | 'Pendente' | 'Cancelada') => {
    MockDataStore.updateMatriculaStatus(id, novoEstado);
    setMatriculas([...MockDataStore.getMatriculas()]);
    toast.success(`Estado da matrícula actualizado para "${novoEstado}".`);
  };

  const filteredMatriculas = matriculas.filter(m => {
    const matchSearch = 
      m.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.classe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || m.estado === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Secretaria • Inscrições & Matrículas" 
        description="Controlo de novas matrículas, renovações e taxas de inscrição do ano lectivo 2026."
        actionLabel="Nova Matrícula"
        onAction={() => {
          setAlunoNome('');
          setContacto('+25884');
          setIsModalOpen(true);
        }}
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Pesquisar por aluno ou número de matrícula..." 
            className="pl-9 bg-slate-50 border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {['Todos', 'Confirmada', 'Pendente', 'Cancelada'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-primary-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Nº Matrícula</th>
                <th className="px-6 py-3.5">Nome do Aluno</th>
                <th className="px-6 py-3.5">Classe & Tipo</th>
                <th className="px-6 py-3.5">Taxa Paga</th>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMatriculas.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-slate-800">
                    {mat.numero}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{mat.alunoNome}</div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Phone size={11} /> {mat.contacto}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{mat.classe}</div>
                    <span className="text-[11px] font-medium text-slate-500">{mat.tipo}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 tabular-nums">
                    {mat.valor.toLocaleString('pt-MZ')} MT
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {mat.dataMatricula}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      mat.estado === 'Confirmada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      mat.estado === 'Pendente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {mat.estado === 'Confirmada' ? <CheckCircle2 size={12} /> :
                       mat.estado === 'Pendente' ? <Clock size={12} /> : <XCircle size={12} />}
                      {mat.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${mat.contacto.replace(/\+/g, '')}?text=${encodeURIComponent(`Estimado Encarregado, confirmamos com sucesso a matrícula do(a) aluno(a) ${mat.alunoNome} para a ${mat.classe} (Ano Lectivo 2026). Referência: ${mat.numero}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        title="Enviar comprovativo via WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                      {mat.estado === 'Pendente' && (
                        <button
                          onClick={() => handleStatusChange(mat.id, 'Confirmada')}
                          className="text-xs font-semibold px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          Confirmar
                        </button>
                      )}
                      {mat.estado === 'Confirmada' && (
                        <button
                          onClick={() => handleStatusChange(mat.id, 'Cancelada')}
                          className="text-xs font-semibold px-2 py-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          Anular
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Matrícula */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                  <FileCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Registar Matrícula</h3>
                  <p className="text-xs text-slate-500">Inscrição de novo aluno ou renovação para 2026</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="mat-nome">Nome do Aluno *</Label>
                <Input 
                  id="mat-nome"
                  value={alunoNome}
                  onChange={(e) => setAlunoNome(e.target.value)}
                  placeholder="Ex: Armando Samora Chissano"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mat-classe">Classe Pretendida</Label>
                  <select
                    id="mat-classe"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Iniciação">Iniciação (Pré-escolar)</option>
                    <option value="1ª Classe">1ª Classe</option>
                    <option value="5ª Classe">5ª Classe</option>
                    <option value="7ª Classe">7ª Classe</option>
                    <option value="8ª Classe">8ª Classe</option>
                    <option value="10ª Classe">10ª Classe</option>
                    <option value="11ª Classe">11ª Classe</option>
                    <option value="12ª Classe">12ª Classe</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mat-tipo">Tipo de Inscrição</Label>
                  <select
                    id="mat-tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Nova Matrícula">Nova Matrícula</option>
                    <option value="Renovação">Renovação de Matrícula</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mat-valor">Taxa de Matrícula (MT)</Label>
                  <Input 
                    id="mat-valor"
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    min={0}
                    step={100}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mat-contacto">WhatsApp Encarregado *</Label>
                  <Input 
                    id="mat-contacto"
                    value={contacto}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Confirmar Matrícula
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
