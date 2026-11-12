'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Pagamento, Aluno } from '@/lib/data/mock-store';
import { 
  Search, 
  Receipt, 
  Plus, 
  CreditCard, 
  Eye, 
  Printer, 
  X, 
  CheckCircle2, 
  Building2,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function PropinasPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(() => MockDataStore.getPagamentos());
  const [alunos, setAlunos] = useState<Aluno[]>(() => MockDataStore.getAlunos());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewRecibo, setPreviewRecibo] = useState<Pagamento | null>(null);

  // Form
  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [mes, setMes] = useState('Fevereiro 2026');
  const [valor, setValor] = useState(2500);
  const [metodo, setMetodo] = useState<Pagamento['metodo']>('M-Pesa');
  const [referencia, setReferencia] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const aluno = alunos.find(a => a.id === selectedAlunoId) || alunos[0];
    if (!aluno) {
      toast.error('Seleccione um aluno.');
      return;
    }

    const novo = MockDataStore.addPagamento({
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      classe: aluno.classe,
      turma: aluno.turma,
      mes,
      valor: Number(valor) || 2500,
      metodo,
      referencia: referencia.trim() || `REF-${Date.now().toString().slice(-6)}`,
      dataPagamento: new Date().toISOString().split('T')[0],
      estado: 'Liquidado'
    });

    setPagamentos([...MockDataStore.getPagamentos()]);
    toast.success(`Pagamento da propina registado com sucesso! Recibo: ${novo.recibo}`);
    setIsModalOpen(false);
    setPreviewRecibo(novo);
  };

  const filteredPagamentos = pagamentos.filter(p => 
    p.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.recibo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArrecadado = filteredPagamentos.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financeiro • Gestão de Propinas" 
        description="Cobrança mensal de propinas, emissão de recibos e conferência de canais de pagamento (M-Pesa, E-Mola, Bancos)."
        actionLabel="Registar Pagamento"
        onAction={() => {
          if (alunos.length > 0) setSelectedAlunoId(alunos[0].id);
          setReferencia(`MP-${Math.floor(100000 + Math.random() * 900000)}`);
          setIsModalOpen(true);
        }}
      />

      {/* KPI & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Pesquisar por aluno, recibo ou referência..." 
              className="pl-9 bg-slate-50 border-slate-200 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-primary-950 text-white p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Total Liquidado</p>
            <h3 className="text-2xl font-bold mt-0.5 tabular-nums">{totalArrecadado.toLocaleString('pt-MZ')} MT</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-white/10">
            <Receipt size={22} className="text-accent-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Recibo Nº</th>
                <th className="px-6 py-3.5">Aluno / Turma</th>
                <th className="px-6 py-3.5">Mês de Referência</th>
                <th className="px-6 py-3.5">Valor Pago</th>
                <th className="px-6 py-3.5">Canal / Referência</th>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPagamentos.map((pag) => (
                <tr key={pag.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-slate-800">
                    {pag.recibo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{pag.alunoNome}</div>
                    <div className="text-xs text-slate-500">{pag.classe} • {pag.turma}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {pag.mes}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-700 tabular-nums">
                    {pag.valor.toLocaleString('pt-MZ')} MT
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-xs text-slate-800">{pag.metodo}</span>
                    <div className="font-mono text-[11px] text-slate-400">{pag.referencia}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {pag.dataPagamento}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewRecibo(pag)}
                      className="text-xs border-slate-200"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Recibo
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Pagamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Registar Pagamento de Propina</h3>
                  <p className="text-xs text-slate-500">Liquidação mensal de propinas e taxas escolares</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pag-aluno">Seleccionar Aluno</Label>
                <select
                  id="pag-aluno"
                  value={selectedAlunoId}
                  onChange={(e) => setSelectedAlunoId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                >
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nome} ({a.classe} - {a.codigo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pag-mes">Mês de Referência</Label>
                  <select
                    id="pag-mes"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Fevereiro 2026">Fevereiro 2026</option>
                    <option value="Março 2026">Março 2026</option>
                    <option value="Abril 2026">Abril 2026</option>
                    <option value="Maio 2026">Maio 2026</option>
                    <option value="Junho 2026">Junho 2026</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pag-valor">Valor Pago (MT)</Label>
                  <Input 
                    id="pag-valor"
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    min={100}
                    step={100}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pag-metodo">Canal de Pagamento</Label>
                  <select
                    id="pag-metodo"
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="M-Pesa">M-Pesa (Vodacom)</option>
                    <option value="E-Mola">E-Mola (Movitel)</option>
                    <option value="Transferência BIM">Millennium BIM</option>
                    <option value="POS">Terminal POS (Cartão)</option>
                    <option value="Numerário">Numerário / Caixa</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pag-ref">Nº Transacção / Ref.</Label>
                  <Input 
                    id="pag-ref"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ex: MP260212.1234"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Confirmar e Gerar Recibo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualização de Recibo */}
      {previewRecibo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-emerald-700" />
                <span className="font-bold text-sm text-slate-800">Recibo Oficial • {previewRecibo.recibo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => window.print()} className="bg-primary-950 text-white text-xs">
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Imprimir
                </Button>
                <button onClick={() => setPreviewRecibo(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-8 space-y-6 bg-slate-50/40">
              <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b pb-4 border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">ESCOLA SECUNDÁRIA NEXUS</h3>
                    <p className="text-xs text-slate-500">NUIT: 400123987 • Maputo, Moçambique</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {previewRecibo.recibo}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{previewRecibo.dataPagamento}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nome do Aluno:</span>
                    <span className="font-bold text-slate-900">{previewRecibo.alunoNome}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Classe / Turma:</span>
                    <span className="font-semibold text-slate-800">{previewRecibo.classe} - {previewRecibo.turma}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Referente ao Mês:</span>
                    <span className="font-semibold text-slate-800">{previewRecibo.mes}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Forma de Pagamento:</span>
                    <span className="font-semibold text-slate-800">{previewRecibo.metodo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Ref. Operação:</span>
                    <span className="font-mono text-slate-800">{previewRecibo.referencia}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-base font-bold bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-100">
                  <span>TOTAL PAGO:</span>
                  <span className="tabular-nums">{previewRecibo.valor.toLocaleString('pt-MZ')} MT</span>
                </div>

                <div className="text-center pt-2 text-[10px] text-slate-400">
                  Processado digitalmente pelo sistema NEXUS School ERP • Maputo, MZ
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
