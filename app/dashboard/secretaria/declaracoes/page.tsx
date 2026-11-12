'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Declaracao, Aluno } from '@/lib/data/mock-store';
import { 
  FileText, 
  Printer, 
  Plus, 
  CheckCircle, 
  Eye, 
  X, 
  Building2, 
  Stamp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function DeclaracoesPage() {
  const [declaracoes, setDeclaracoes] = useState<Declaracao[]>(() => MockDataStore.getDeclaracoes());
  const [alunos, setAlunos] = useState<Aluno[]>(() => MockDataStore.getAlunos());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewDec, setPreviewDec] = useState<Declaracao | null>(null);

  // Form State
  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [tipo, setTipo] = useState<Declaracao['tipo']>('Declaração de Matrícula');
  const [finalidade, setFinalidade] = useState('Para efeitos de emissão de Bilhete de Identidade');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const aluno = alunos.find(a => a.id === selectedAlunoId) || alunos[0];
    if (!aluno) {
      toast.error('Seleccione um aluno matriculado.');
      return;
    }

    const nova = MockDataStore.addDeclaracao({
      tipo,
      alunoNome: aluno.nome,
      alunoCodigo: aluno.codigo,
      classe: aluno.classe,
      turma: aluno.turma,
      finalidade,
      dataEmissao: new Date().toISOString().split('T')[0],
      estado: 'Emitida'
    });

    setDeclaracoes([...MockDataStore.getDeclaracoes()]);
    toast.success(`Declaração emitida com sucesso! Referência: ${nova.numero}`);
    setIsModalOpen(false);
    setPreviewDec(nova);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Secretaria • Emissão de Declarações & Certificados" 
        description="Geração instantânea de certidões, declarações com notas e certificados oficiais no padrão MINEDH."
        actionLabel="Emitir Declaração"
        onAction={() => {
          if (alunos.length > 0) setSelectedAlunoId(alunos[0].id);
          setIsModalOpen(true);
        }}
      />

      {/* Grid of Declarations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {declaracoes.map((dec) => (
          <div key={dec.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {dec.numero}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {dec.estado}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <FileText size={16} className="text-primary-900" />
                  {dec.tipo}
                </h3>
                <p className="text-sm font-semibold text-slate-800 mt-1">{dec.alunoNome}</p>
                <p className="text-xs text-slate-500">{dec.classe} • {dec.turma} ({dec.alunoCodigo})</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <p className="font-medium text-slate-400 text-[10px] uppercase">Finalidade:</p>
                <p className="italic mt-0.5">{dec.finalidade}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">{dec.dataEmissao}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPreviewDec(dec)}
                className="text-xs border-slate-200"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Ver & Imprimir
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Emitir Nova Declaração */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Emitir Documento Oficial</h3>
                  <p className="text-xs text-slate-500">Seleccione o aluno e o modelo de declaração</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dec-aluno">Seleccionar Aluno Matriculado</Label>
                <select
                  id="dec-aluno"
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

              <div className="space-y-1.5">
                <Label htmlFor="dec-tipo">Tipo de Documento</Label>
                <select
                  id="dec-tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                >
                  <option value="Declaração de Matrícula">Declaração de Matrícula</option>
                  <option value="Declaração com Notas">Declaração de Frequência com Notas</option>
                  <option value="Declaração sem Notas">Declaração de Frequência sem Notas</option>
                  <option value="Certificado de Habilitações">Certificado de Habilitações Literárias</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dec-fin">Finalidade do Documento</Label>
                <Input 
                  id="dec-fin"
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  placeholder="Ex: Para efeitos de candidatura a Bolsa de Estudos"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Gerar Documento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview & Impressão Oficial do Documento */}
      {previewDec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary-950" />
                <span className="font-bold text-sm text-slate-800">Visualização de Impressão • {previewDec.numero}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => window.print()} className="bg-primary-950 text-white">
                  <Printer className="mr-1.5 h-4 w-4" /> Imprimir
                </Button>
                <button onClick={() => setPreviewDec(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Official Mozambican School Letterhead Format */}
            <div className="p-10 overflow-y-auto space-y-8 bg-white font-serif text-slate-900 border-8 border-slate-100 m-4 rounded-xl">
              <div className="text-center space-y-1 border-b pb-6 border-slate-300">
                <p className="text-xs font-bold tracking-widest uppercase">REPÚBLICA DE MOÇAMBIQUE</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-600">MINISTÉRIO DA EDUCAÇÃO E DESENVOLVIMENTO HUMANO</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-600">DIRECÇÃO PROVINCIAL DA EDUCAÇÃO</p>
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900 pt-2">
                  ESCOLA SECUNDÁRIA NEXUS
                </h2>
                <p className="text-[10px] text-slate-500 font-sans">
                  Av. Samora Machel, Bairro Central, Maputo • Telefone: +258 21 000 000 • Email: secretaria@nexus.ac.mz
                </p>
              </div>

              <div className="text-center py-2">
                <h3 className="text-lg font-bold uppercase tracking-wider underline underline-offset-8">
                  {previewDec.tipo}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-2">Registo Nº: {previewDec.numero}</p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-justify indent-8">
                <p>
                  Para os devidos efeitos e a pedido da parte interessada, certifica-se por este meio que o(a) aluno(a) 
                  <strong className="font-bold mx-1 uppercase">{previewDec.alunoNome}</strong>, portador(a) do código estudantil 
                  <span className="font-mono font-semibold mx-1">{previewDec.alunoCodigo}</span>, encontra-se devidamente matriculado(a) 
                  nesta instituição de ensino no Ano Lectivo de 2026, frequentando a <strong className="font-bold">{previewDec.classe}</strong>, 
                  inserido(a) na <strong className="font-bold">{previewDec.turma}</strong>.
                </p>
                <p>
                  Constatou-se através dos livros de registo desta Secretaria que o(a) referido(a) estudante mantém a sua situação 
                  académica regularizada, destinando-se a presente declaração exclusivamente:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs italic text-center font-sans">
                  &ldquo;{previewDec.finalidade}&rdquo;
                </div>
                <p>
                  E, por ser verdade e constar nos arquivos da Secretaria Geral desta Escola, mandou-se passar a presente declaração que vai 
                  assinada pelas autoridades competentes e autenticada com o carimbo a óleo em uso nesta instituição.
                </p>
              </div>

              <div className="pt-10 flex items-end justify-between text-xs">
                <div>
                  <p>Maputo, {previewDec.dataEmissao}</p>
                  <p className="mt-8 font-bold border-t border-slate-400 pt-1 w-48 text-center font-sans">
                    O Chefe da Secretaria
                  </p>
                </div>

                <div className="text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[9px] uppercase text-slate-400 font-sans mb-1">
                    Carimbo a Óleo
                  </div>
                  <p className="font-bold border-t border-slate-400 pt-1 w-48 text-center font-sans">
                    O Director da Escola
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
