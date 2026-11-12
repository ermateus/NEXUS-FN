'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { MockDataStore, Turma } from '@/lib/data/mock-store';
import { 
  Search, 
  BookOpen, 
  Users, 
  Trash2, 
  Plus, 
  X, 
  Clock, 
  DoorClosed, 
  UserCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>(() => MockDataStore.getTurmas());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurno, setSelectedTurno] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState<'Pré-escolar' | 'Primário' | 'Secundário'>('Secundário');
  const [classe, setClasse] = useState('10ª Classe');
  const [turno, setTurno] = useState<'Manhã' | 'Tarde' | 'Noite'>('Manhã');
  const [sala, setSala] = useState('Sala 05');
  const [directorTurma, setDirectorTurma] = useState('Prof. Sérgio Sitoe');
  const [capacidade, setCapacidade] = useState(40);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('Indique o nome da turma.');
      return;
    }

    MockDataStore.addTurma({
      nome,
      nivel,
      classe,
      turno,
      sala,
      directorTurma,
      totalAlunos: 0,
      capacidade: Number(capacidade) || 40
    });

    setTurmas([...MockDataStore.getTurmas()]);
    toast.success(`Turma ${nome} criada com sucesso!`);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, turmaNome: string) => {
    if (confirm(`Tem a certeza que pretende fechar a turma ${turmaNome}?`)) {
      MockDataStore.deleteTurma(id);
      setTurmas([...MockDataStore.getTurmas()]);
      toast.success(`Turma ${turmaNome} removida.`);
    }
  };

  const filteredTurmas = turmas.filter(t => {
    const matchSearch = 
      t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.directorTurma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sala.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTurno = selectedTurno === 'Todos' || t.turno === selectedTurno;
    return matchSearch && matchTurno;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Turmas" 
        description="Salas de aula, lotação, turnos e directores de turma atribuídos."
        actionLabel="Nova Turma"
        onAction={() => {
          setNome('');
          setSala('Sala 05');
          setIsModalOpen(true);
        }}
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Pesquisar por turma, director ou sala..." 
            className="pl-9 bg-slate-50 border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {['Todos', 'Manhã', 'Tarde', 'Noite'].map((turnoLabel) => (
            <button
              key={turnoLabel}
              onClick={() => setSelectedTurno(turnoLabel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTurno === turnoLabel
                  ? 'bg-primary-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {turnoLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTurmas.map((turma) => {
          const percent = Math.min(100, Math.round((turma.totalAlunos / turma.capacidade) * 100));
          return (
            <div key={turma.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {turma.codigo}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{turma.nome}</h3>
                    <p className="text-xs text-slate-500">{turma.classe} • {turma.nivel}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    turma.turno === 'Manhã' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    turma.turno === 'Tarde' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {turma.turno}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <DoorClosed size={14} /> Sala:
                    </span>
                    <span className="font-semibold text-slate-800">{turma.sala}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <UserCheck size={14} /> Director:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{turma.directorTurma}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Ocupação de Vagas</span>
                    <span className="text-slate-800 font-bold">{turma.totalAlunos} / {turma.capacidade} alunos ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        percent >= 90 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ano Lectivo 2026</span>
                <button
                  onClick={() => handleDelete(turma.id, turma.nome)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar turma"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Turma */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Criar Nova Turma</h3>
                  <p className="text-xs text-slate-500">Configuração de sala, turno e director pedagógico</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="turma-nome">Designação da Turma *</Label>
                <Input 
                  id="turma-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: 11ª Classe - Turma B"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="turma-nivel">Nível</Label>
                  <select
                    id="turma-nivel"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Pré-escolar">Pré-escolar</option>
                    <option value="Primário">Primário</option>
                    <option value="Secundário">Secundário</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="turma-turno">Turno</Label>
                  <select
                    id="turma-turno"
                    value={turno}
                    onChange={(e) => setTurno(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Manhã">Manhã (07h00 - 12h30)</option>
                    <option value="Tarde">Tarde (12h45 - 17h30)</option>
                    <option value="Noite">Noite (18h00 - 22h00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="turma-sala">Sala Atribuída</Label>
                  <Input 
                    id="turma-sala"
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                    placeholder="Ex: Sala 04 (Bloco Central)"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="turma-cap">Capacidade Máxima</Label>
                  <Input 
                    id="turma-cap"
                    type="number"
                    value={capacidade}
                    onChange={(e) => setCapacidade(Number(e.target.value))}
                    min={10}
                    max={60}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="turma-dt">Director(a) de Turma</Label>
                <Input 
                  id="turma-dt"
                  value={directorTurma}
                  onChange={(e) => setDirectorTurma(e.target.value)}
                  placeholder="Ex: Prof. Sérgio Sitoe"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white font-medium">
                  Criar Turma
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
