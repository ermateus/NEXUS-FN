'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Aluno } from '@/lib/data/mock-store';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  MessageCircle, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  GraduationCap,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>(() => MockDataStore.getAlunos());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState<'Pré-escolar' | 'Primário' | 'Secundário'>('Secundário');
  const [classe, setClasse] = useState('10ª Classe');
  const [turma, setTurma] = useState('Turma A');
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [dataNascimento, setDataNascimento] = useState('2009-01-01');
  const [encarregado, setEncarregado] = useState('');
  const [contacto, setContacto] = useState('+258');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+258')) {
      val = '+258' + val.replace(/^\+?258?/, '');
    }
    const cleanNumbers = val.substring(4).replace(/\D/g, '').slice(0, 9);
    setContacto(`+258${cleanNumbers}`);
  };

  const handleOpenNew = () => {
    setEditingAluno(null);
    setNome('');
    setNivel('Secundário');
    setClasse('10ª Classe');
    setTurma('Turma A');
    setSexo('M');
    setDataNascimento('2009-01-01');
    setEncarregado('');
    setContacto('+25884');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !encarregado.trim()) {
      toast.error('Preencha os campos obrigatórios (Nome do Aluno e Encarregado).');
      return;
    }

    if (contacto.length < 13) {
      toast.error('O contacto deve incluir o indicativo +258 seguido de 9 dígitos.');
      return;
    }

    if (editingAluno) {
      const updated = MockDataStore.updateAluno(editingAluno.id, {
        nome,
        nivel,
        classe,
        turma,
        sexo,
        dataNascimento,
        encarregado,
        contacto
      });
      if (updated) {
        toast.success(`Dados de ${nome} actualizados com sucesso!`);
      }
    } else {
      MockDataStore.addAluno({
        nome,
        nivel,
        classe,
        turma,
        sexo,
        dataNascimento,
        encarregado,
        contacto,
        estado: 'Activo',
        propinaStatus: 'Regular'
      });
      toast.success(`Aluno ${nome} matriculado com sucesso!`);
    }

    setAlunos([...MockDataStore.getAlunos()]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, alunoNome: string) => {
    if (confirm(`Tem a certeza que deseja eliminar o registo do aluno ${alunoNome}?`)) {
      MockDataStore.deleteAluno(id);
      setAlunos([...MockDataStore.getAlunos()]);
      toast.success(`Aluno ${alunoNome} removido do sistema.`);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Código,Nome,Nível,Classe,Turma,Sexo,Encarregado,Contacto,Estado,Propina"]
      .concat(filteredAlunos.map(a => `${a.codigo},"${a.nome}",${a.nivel},"${a.classe}","${a.turma}",${a.sexo},"${a.encarregado}",${a.contacto},${a.estado},${a.propinaStatus}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Alunos_NEXUS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Lista de alunos exportada em formato CSV!');
  };

  const filteredAlunos = alunos.filter(a => {
    const matchesSearch = 
      a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.encarregado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.classe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = selectedNivel === 'Todos' || a.nivel === selectedNivel;
    return matchesSearch && matchesNivel;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Alunos" 
        description="Registo central, matrículas ativas e fichas biográficas dos estudantes."
        actionLabel="Novo Aluno"
        onAction={handleOpenNew}
        onExport={handleExport}
      />

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Pesquisar por nome, código ou turma..." 
            className="pl-9 bg-slate-50 border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['Todos', 'Pré-escolar', 'Primário', 'Secundário'].map((nivelLabel) => (
            <button
              key={nivelLabel}
              onClick={() => setSelectedNivel(nivelLabel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedNivel === nivelLabel
                  ? 'bg-primary-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {nivelLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Alunos Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Código / Aluno</th>
                <th className="px-6 py-3.5">Nível & Turma</th>
                <th className="px-6 py-3.5">Encarregado / Contacto</th>
                <th className="px-6 py-3.5">Propina</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Nenhum aluno encontrado</p>
                    <p className="text-xs text-slate-400 mt-1">Tente ajustar a pesquisa ou adicione um novo aluno.</p>
                  </td>
                </tr>
              ) : (
                filteredAlunos.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{aluno.nome}</div>
                      <div className="text-xs font-mono text-slate-400">{aluno.codigo} • {aluno.sexo === 'M' ? 'Masc' : 'Fem'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{aluno.classe}</div>
                      <div className="text-xs text-slate-500">{aluno.turma} ({aluno.nivel})</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800">{aluno.encarregado}</div>
                      <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone size={12} className="text-slate-400" />
                        {aluno.contacto}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        aluno.propinaStatus === 'Regular'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {aluno.propinaStatus === 'Regular' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {aluno.propinaStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {aluno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Contact Link */}
                        <a
                          href={`https://wa.me/${aluno.contacto.replace(/\+/g, '')}?text=${encodeURIComponent(`Olá Sr(a). ${aluno.encarregado}, contactamos da Direcção Escolar sobre o(a) aluno(a) ${aluno.nome}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Contactar Encarregado via WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <button
                          onClick={() => {
                            setEditingAluno(aluno);
                            setNome(aluno.nome);
                            setNivel(aluno.nivel);
                            setClasse(aluno.classe);
                            setTurma(aluno.turma);
                            setSexo(aluno.sexo);
                            setDataNascimento(aluno.dataNascimento);
                            setEncarregado(aluno.encarregado);
                            setContacto(aluno.contacto);
                            setIsModalOpen(true);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(aluno.id, aluno.nome)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar aluno"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo / Editar Aluno */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingAluno ? 'Actualizar Ficha do Aluno' : 'Registar Novo Aluno'}
                  </h3>
                  <p className="text-xs text-slate-500">Dados biográficos e contacto do encarregado de educação</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <Label htmlFor="aluno-nome">Nome Completo do Aluno *</Label>
                <Input 
                  id="aluno-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Samora Moisés Machel Júnior"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aluno-nivel">Nível de Ensino</Label>
                  <select
                    id="aluno-nivel"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Pré-escolar">Pré-escolar</option>
                    <option value="Primário">Ensino Primário</option>
                    <option value="Secundário">Ensino Secundário Geral</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aluno-classe">Classe</Label>
                  <select
                    id="aluno-classe"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    {nivel === 'Pré-escolar' && (
                      <>
                        <option value="Maternal">Maternal (2-3 anos)</option>
                        <option value="Jardim">Jardim (3-4 anos)</option>
                        <option value="Iniciação">Iniciação (5 anos)</option>
                      </>
                    )}
                    {nivel === 'Primário' && (
                      <>
                        <option value="1ª Classe">1ª Classe</option>
                        <option value="2ª Classe">2ª Classe</option>
                        <option value="3ª Classe">3ª Classe</option>
                        <option value="4ª Classe">4ª Classe</option>
                        <option value="5ª Classe">5ª Classe</option>
                        <option value="6ª Classe">6ª Classe</option>
                      </>
                    )}
                    {nivel === 'Secundário' && (
                      <>
                        <option value="7ª Classe">7ª Classe</option>
                        <option value="8ª Classe">8ª Classe</option>
                        <option value="9ª Classe">9ª Classe</option>
                        <option value="10ª Classe">10ª Classe</option>
                        <option value="11ª Classe">11ª Classe</option>
                        <option value="12ª Classe">12ª Classe</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aluno-turma">Turma</Label>
                  <select
                    id="aluno-turma"
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Turma A">Turma A</option>
                    <option value="Turma B">Turma B</option>
                    <option value="Turma C">Turma C</option>
                    <option value="Jardim A">Jardim A</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aluno-sexo">Sexo</Label>
                  <select
                    id="aluno-sexo"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Feminino (F)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aluno-nasc">Data de Nascimento</Label>
                  <Input 
                    id="aluno-nasc"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Encarregado de Educação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="encarregado-nome">Nome do Encarregado *</Label>
                    <Input 
                      id="encarregado-nome"
                      value={encarregado}
                      onChange={(e) => setEncarregado(e.target.value)}
                      placeholder="Ex: Alberto Macamo"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="encarregado-tel">Contacto WhatsApp (Moçambique) *</Label>
                    <Input 
                      id="encarregado-tel"
                      value={contacto}
                      onChange={handlePhoneChange}
                      placeholder="+258841234567"
                      required
                    />
                    <p className="text-[11px] text-slate-400">Prefixo +258 obrigatório para avisos de propinas</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  {editingAluno ? 'Guardar Alterações' : 'Matricular Aluno'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
