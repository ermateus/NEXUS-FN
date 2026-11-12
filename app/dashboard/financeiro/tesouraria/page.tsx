'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, MovimentoTesouraria } from '@/lib/data/mock-store';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Plus, 
  X,
  CreditCard,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TesourariaPage() {
  const [movimentos, setMovimentos] = useState<MovimentoTesouraria[]>(() => MockDataStore.getTesouraria());
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'Todos' | 'Receita' | 'Despesa'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [tipo, setTipo] = useState<'Receita' | 'Despesa'>('Receita');
  const [categoria, setCategoria] = useState('Propinas');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(1500);
  const [formaPagamento, setFormaPagamento] = useState('M-Pesa Business');
  const [responsavel, setResponsavel] = useState('Tesouraria Central');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      toast.error('Indique a descrição do lançamento financeiro.');
      return;
    }

    MockDataStore.addMovimentoTesouraria({
      tipo,
      categoria,
      descricao,
      valor: Number(valor) || 0,
      data: new Date().toISOString().split('T')[0],
      formaPagamento,
      responsavel
    });

    setMovimentos([...MockDataStore.getTesouraria()]);
    toast.success(`Lançamento de ${tipo.toLowerCase()} registado na tesouraria!`);
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Data,Tipo,Categoria,Descrição,Valor (MT),Forma Pagamento,Responsável"]
      .concat(filteredMovimentos.map(m => `${m.data},${m.tipo},"${m.categoria}","${m.descricao}",${m.valor},"${m.formaPagamento}","${m.responsavel}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tesouraria_NEXUS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Extrato da tesouraria exportado!');
  };

  const totalReceitas = useMemo(() => {
    return movimentos.filter(m => m.tipo === 'Receita').reduce((acc, m) => acc + m.valor, 0);
  }, [movimentos]);

  const totalDespesas = useMemo(() => {
    return movimentos.filter(m => m.tipo === 'Despesa').reduce((acc, m) => acc + m.valor, 0);
  }, [movimentos]);

  const saldoDisponivel = totalReceitas - totalDespesas;

  const filteredMovimentos = movimentos.filter(m => {
    const matchSearch = 
      m.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFilter === 'Todos' || m.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financeiro • Tesouraria & Fluxo de Caixa" 
        description="Gestão integrada de entradas, despesas operacionais e conciliação bancária."
        actionLabel="Novo Movimento"
        onAction={() => {
          setDescricao('');
          setIsModalOpen(true);
        }}
        onExport={handleExport}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Receitas</p>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-700 tabular-nums">
            {totalReceitas.toLocaleString('pt-MZ')} MT
          </h2>
          <p className="text-xs text-slate-400 mt-2">Arrecadação de propinas e taxas</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Despesas</p>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-700 tabular-nums">
            {totalDespesas.toLocaleString('pt-MZ')} MT
          </h2>
          <p className="text-xs text-slate-400 mt-2">Custos operacionais e manutenção</p>
        </div>

        <div className="bg-primary-950 text-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Líquido em Caixa</p>
            <div className="p-2.5 rounded-xl bg-white/10 text-accent-400">
              <Wallet size={20} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
            {saldoDisponivel.toLocaleString('pt-MZ')} MT
          </h2>
          <p className="text-xs text-slate-300 mt-2">Disponibilidade financeira total</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Pesquisar por descrição, categoria..." 
            className="pl-9 bg-slate-50 border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {(['Todos', 'Receita', 'Despesa'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipoFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tipoFilter === t
                  ? 'bg-primary-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'Todos' ? 'Todos os Movimentos' : t === 'Receita' ? 'Apenas Receitas' : 'Apenas Despesas'}
            </button>
          ))}
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5">Tipo</th>
                <th className="px-6 py-3.5">Categoria / Descrição</th>
                <th className="px-6 py-3.5">Valor</th>
                <th className="px-6 py-3.5">Canal Pagamento</th>
                <th className="px-6 py-3.5">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovimentos.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {mov.data}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      mov.tipo === 'Receita' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {mov.tipo === 'Receita' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                      {mov.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{mov.descricao}</div>
                    <div className="text-xs text-slate-500 font-medium">{mov.categoria}</div>
                  </td>
                  <td className={`px-6 py-4 font-bold tabular-nums text-sm ${
                    mov.tipo === 'Receita' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {mov.tipo === 'Receita' ? '+' : '-'}{mov.valor.toLocaleString('pt-MZ')} MT
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {mov.formaPagamento}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {mov.responsavel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Movimento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Novo Lançamento de Caixa</h3>
                  <p className="text-xs text-slate-500">Registo de receita ou despesa na tesouraria</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Tipo de Movimento</Label>
                  <select
                    value={tipo}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setTipo(t);
                      if (t === 'Receita') setCategoria('Propinas');
                      else setCategoria('Material Escolar & Escritório');
                    }}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Receita">Receita (Entrada)</option>
                    <option value="Despesa">Despesa (Saída)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Categoria</Label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    {tipo === 'Receita' ? (
                      <>
                        <option value="Propinas">Propinas</option>
                        <option value="Matrículas">Matrículas</option>
                        <option value="Declarações e Certificados">Declarações e Certificados</option>
                        <option value="Uniformes e Material">Uniformes e Material</option>
                        <option value="Outras Receitas">Outras Receitas</option>
                      </>
                    ) : (
                      <>
                        <option value="Material Escolar & Escritório">Material Escolar & Escritório</option>
                        <option value="Infraestrutura & Manutenção">Infraestrutura & Manutenção</option>
                        <option value="Telecomunicações e Internet">Telecomunicações e Internet</option>
                        <option value="Água e Electricidade (EDM)">Água e Electricidade (EDM)</option>
                        <option value="Salários e Honorários">Salários e Honorários</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mov-desc">Descrição do Movimento *</Label>
                <Input 
                  id="mov-desc"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Aquisição de resmas de papel para exames"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mov-valor">Valor (MT) *</Label>
                  <Input 
                    id="mov-valor"
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Forma de Pagamento</Label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="M-Pesa Business">M-Pesa Business</option>
                    <option value="E-Mola Paybill">E-Mola Paybill</option>
                    <option value="Transferência BIM">Millennium BIM</option>
                    <option value="Numerário / Caixa">Numerário / Caixa</option>
                    <option value="Cheque Bancário">Cheque Bancário</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mov-resp">Responsável pelo Lançamento</Label>
                <Input 
                  id="mov-resp"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Registar Movimento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
