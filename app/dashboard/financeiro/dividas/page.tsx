'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Divida } from '@/lib/data/mock-store';
import { 
  AlertTriangle, 
  MessageSquare, 
  Phone, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Send,
  Building2,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function DividasPage() {
  const [dividas, setDividas] = useState<Divida[]>(() => MockDataStore.getDividas());
  const [searchTerm, setSearchTerm] = useState('');

  const handleWhatsAppSend = (divida: Divida) => {
    MockDataStore.recordWhatsAppCobrança(divida.id);
    setDividas([...MockDataStore.getDividas()]);

    const msg = `Exmo(a) Sr(a). ${divida.encarregado},\n\nSaudações cordiais da Direcção Financeira da Escola NEXUS.\n\nVimos por este meio lembrar com respeito que o(a) aluno(a) *${divida.alunoNome}* (${divida.classe} - ${divida.turma}) tem propinas pendentes referentes a: *${divida.mesesEmAtraso.join(', ')}*, perfazendo um valor total de *${divida.valorTotal.toLocaleString('pt-MZ')} MT*.\n\nPedimos a gentileza de regularizar a situação para evitar sobretaxas administrativas.\n\n*Canais de Pagamento Autorizados:*\n• M-Pesa Pagamentos: *84 000 000* (Ref: ${divida.alunoNome.split(' ')[0]})\n• Millennium BIM: *0001 0000 00123456789 01*\n\nCom os melhores cumprimentos,\n*Departamento de Tesouraria - NEXUS ERP*`;

    const cleanPhone = divida.contacto.replace(/\+/g, '').replace(/\s/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    
    // Create hidden anchor to avoid window.open blocker
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Aviso de cobrança enviado para ${divida.encarregado} via WhatsApp!`);
  };

  const handleDisparoGeral = () => {
    if (confirm(`Pretende registar envio de lembretes para todos os ${filteredDividas.length} encarregados em dívida?`)) {
      filteredDividas.forEach(d => MockDataStore.recordWhatsAppCobrança(d.id));
      setDividas([...MockDataStore.getDividas()]);
      toast.success(`Disparo em lote concluído para ${filteredDividas.length} encarregados!`);
    }
  };

  const totalEmDivida = useMemo(() => {
    return dividas.reduce((acc, d) => acc + d.valorTotal, 0);
  }, [dividas]);

  const filteredDividas = dividas.filter(d => 
    d.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.encarregado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financeiro • Cobrança de Propinas & Dívidas" 
        description="Gestão de mensalidades em atraso com disparo automático de avisos cordiais via WhatsApp."
        showWhatsApp={true}
        onWhatsApp={handleDisparoGeral}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Montante Global em Atraso</p>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-600 tabular-nums">
            {totalEmDivida.toLocaleString('pt-MZ')} MT
          </h2>
          <p className="text-xs text-slate-400 mt-2">Valores por regularizar na escola</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estudantes com Pendências</p>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tabular-nums">
            {dividas.length} Alunos
          </h2>
          <p className="text-xs text-slate-400 mt-2">Com 1 ou mais meses em atraso</p>
        </div>

        <div className="bg-primary-950 text-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Taxa de Recuperação</p>
            <div className="p-2.5 rounded-xl bg-white/10 text-accent-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
            87.4%
          </h2>
          <p className="text-xs text-slate-300 mt-2">Eficácia dos avisos via WhatsApp</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Pesquisar aluno, encarregado..." 
            className="pl-9 bg-slate-50 border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleDisparoGeral}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm w-full md:w-auto"
        >
          <Send className="mr-2 h-3.5 w-3.5" /> Disparar Avisos em Lote WhatsApp
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Aluno / Turma</th>
                <th className="px-6 py-3.5">Encarregado & WhatsApp</th>
                <th className="px-6 py-3.5">Meses Pendentes</th>
                <th className="px-6 py-3.5">Dívida Total</th>
                <th className="px-6 py-3.5">Atraso</th>
                <th className="px-6 py-3.5">Último Aviso</th>
                <th className="px-6 py-3.5 text-right">Cobrança WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDividas.map((div) => (
                <tr key={div.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{div.alunoNome}</div>
                    <div className="text-xs text-slate-500">{div.classe} • {div.turma}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{div.encarregado}</div>
                    <div className="text-xs font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone size={12} className="text-slate-400" />
                      {div.contacto}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {div.mesesEmAtraso.map(m => (
                        <span key={m} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-red-600 tabular-nums">
                    {div.valorTotal.toLocaleString('pt-MZ')} MT
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {div.diasAtraso} dias
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {div.ultimoAvisoWhatsApp || 'Não enviado'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handleWhatsAppSend(div)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm"
                    >
                      <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Enviar Cobrança
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
