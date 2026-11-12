'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Professor } from '@/lib/data/mock-store';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  Trash2, 
  MessageCircle, 
  GraduationCap, 
  X,
  BookOpen,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>(() => MockDataStore.getProfessores());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [contacto, setContacto] = useState('+25884');
  const [email, setEmail] = useState('');
  const [disciplinas, setDisciplinas] = useState('Matemática, Física');
  const [turmas, setTurmas] = useState('10ª A, 12ª B');
  const [habilitacoes, setHabilitacoes] = useState('Licenciatura em Ensino - UP Maputo');

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
    if (!nome.trim() || !contacto.trim()) {
      toast.error('Preencha os campos obrigatórios (Nome e Contacto).');
      return;
    }

    const discArray = disciplinas.split(',').map(d => d.trim()).filter(Boolean);
    const turmasArray = turmas.split(',').map(t => t.trim()).filter(Boolean);

    MockDataStore.addProfessor({
      nome,
      sexo,
      contacto,
      email: email || `${nome.toLowerCase().replace(/\s+/g, '.')}@nexus.ac.mz`,
      disciplinas: discArray,
      turmas: turmasArray,
      habilitacoes,
      estado: 'Activo'
    });

    setProfessores([...MockDataStore.getProfessores()]);
    toast.success(`Docente ${nome} adicionado com sucesso!`);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, profNome: string) => {
    if (confirm(`Pretende desvincular o professor ${profNome}?`)) {
      MockDataStore.deleteProfessor(id);
      setProfessores([...MockDataStore.getProfessores()]);
      toast.success(`Docente ${profNome} removido.`);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Código,Nome,Sexo,Contacto,Email,Disciplinas,Habilitações,Estado"]
      .concat(filteredProfessores.map(p => `${p.codigo},"${p.nome}",${p.sexo},${p.contacto},"${p.email}","${p.disciplinas.join(' / ')}","${p.habilitacoes}",${p.estado}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Professores_NEXUS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Lista de docentes exportada com sucesso!');
  };

  const filteredProfessores = professores.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.disciplinas.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Corpo Docente" 
        description="Gestão de professores, carga horária lectiva e atribuição de turmas."
        actionLabel="Registar Professor"
        onAction={() => {
          setNome('');
          setContacto('+25884');
          setEmail('');
          setIsModalOpen(true);
        }}
        onExport={handleExport}
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Pesquisar docente ou disciplina..." 
            className="pl-9 bg-slate-50 border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total de Professores Activos: <span className="text-slate-900 font-bold">{filteredProfessores.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessores.map((prof) => (
          <div key={prof.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center font-bold text-base border border-accent-200">
                    {prof.nome.replace('Prof. ', '').replace('Prof.ª ', '').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-snug">{prof.nome}</h3>
                    <p className="text-xs font-mono text-slate-400">{prof.codigo} • {prof.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {prof.estado}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-400" />
                  <span className="font-mono">{prof.contacto}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-400" />
                  <span className="truncate">{prof.email}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                  <Award size={14} className="text-accent-600 shrink-0 mt-0.5" />
                  <span className="text-slate-500 italic">{prof.habilitacoes}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Disciplinas & Turmas</p>
                <div className="flex flex-wrap gap-1.5">
                  {prof.disciplinas.map((d) => (
                    <span key={d} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-xs font-medium">
                      {d}
                    </span>
                  ))}
                  {prof.turmas.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${prof.contacto.replace(/\+/g, '')}?text=${encodeURIComponent(`Olá ${prof.nome}, saudações da Direcção Pedagógica NEXUS.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle size={15} /> WhatsApp Directo
              </a>
              <button
                onClick={() => handleDelete(prof.id, prof.nome)}
                className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                title="Remover docente"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Professor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Registar Docente</h3>
                  <p className="text-xs text-slate-500">Adicionar novo professor ao corpo docente da escola</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-nome">Nome Completo do Docente *</Label>
                <Input 
                  id="prof-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Prof. Dr. Armando Nhaca"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-sexo">Sexo</Label>
                  <select
                    id="prof-sexo"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Feminino (F)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prof-tel">Contacto WhatsApp (+258) *</Label>
                  <Input 
                    id="prof-tel"
                    value={contacto}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email">Email Institucional</Label>
                <Input 
                  id="prof-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome.sobrenome@nexus.ac.mz"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-disc">Disciplinas Leccionadas (separadas por vírgula)</Label>
                <Input 
                  id="prof-disc"
                  value={disciplinas}
                  onChange={(e) => setDisciplinas(e.target.value)}
                  placeholder="Ex: Matemática, Física, Estatística"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-turmas">Turmas Atribuídas</Label>
                <Input 
                  id="prof-turmas"
                  value={turmas}
                  onChange={(e) => setTurmas(e.target.value)}
                  placeholder="Ex: 10ª A, 11ª B, 12ª A"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-hab">Habilitações Literárias & Instituição</Label>
                <Input 
                  id="prof-hab"
                  value={habilitacoes}
                  onChange={(e) => setHabilitacoes(e.target.value)}
                  placeholder="Ex: Licenciatura em Ensino de Química - UP Maputo"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Registar Docente
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
