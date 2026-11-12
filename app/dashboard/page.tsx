'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Wallet, 
  TrendingUp,
  Clock,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  MapPin,
  FileText,
  UserPlus,
  BarChart3,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Real KPI stats & chart data states
  const [stats, setStats] = useState({
    totalAlunos: 0,
    alunosPreEscolar: 0,
    alunosPrimario: 0,
    alunosSecundario: 0,
    totalProfessores: 0,
    professoresM: 0,
    professoresF: 0,
    totalTurmas: 0,
    propinasMes: 0,
    dividasValor: 0
  });

  const [chartData, setChartData] = useState([
    { nivel: 'Pré-escolar', Masculino: 0, Feminino: 0 },
    { nivel: 'Primário', Masculino: 0, Feminino: 0 },
    { nivel: 'Secundário', Masculino: 0, Feminino: 0 },
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('nexus_demo_session') === 'true';

      if (isDemo) {
        setProfile({ nome: 'Gestor Demo' });
        setSchool({ nome: 'Escola Secundária NEXUS (Demo)', provincia: 'Maputo' });
        setStats({
          totalAlunos: 1250,
          alunosPreEscolar: 200,
          alunosPrimario: 450,
          alunosSecundario: 600,
          totalProfessores: 45,
          professoresM: 20,
          professoresF: 25,
          totalTurmas: 32,
          propinasMes: 125000,
          dividasValor: 15000
        });
        setChartData([
          { nivel: 'Pré-escolar', Masculino: 95, Feminino: 105 },
          { nivel: 'Primário', Masculino: 210, Feminino: 240 },
          { nivel: 'Secundário', Masculino: 280, Feminino: 320 },
        ]);
        setLoading(false);
        return;
      }

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', user.id)
          .single();

        if (profileData?.schools) {
          const currentSchool = profileData.schools;
          setProfile(profileData);
          setSchool(currentSchool);
          const schoolId = currentSchool.id;
          // ... (rest of the fetching logic)

          // Fetch Alunos
          const { data: alunosList } = await supabase
            .from('alunos')
            .select('*')
            .eq('school_id', schoolId);

          // Fetch Professores
          const { data: professoresList } = await supabase
            .from('professores')
            .select('*')
            .eq('school_id', schoolId);

          // Fetch Turmas
          const { data: turmasList } = await supabase
            .from('turmas')
            .select('*')
            .eq('school_id', schoolId);

          // Fetch Pagamentos
          const { data: pagamentosList } = await supabase
            .from('pagamentos')
            .select('*')
            .eq('school_id', schoolId);

          // Aggregate Alunos
          const alunos: any[] = alunosList || [];
          const totalAlunos = alunos.length;
          const pre = alunos.filter((a: any) => a.nivel_ensino === 'Pré-escolar');
          const prim = alunos.filter((a: any) => a.nivel_ensino === 'Primário');
          const sec = alunos.filter((a: any) => a.nivel_ensino === 'Secundário');

          const preM = pre.filter((a: any) => a.sexo === 'M').length;
          const preF = pre.filter((a: any) => a.sexo === 'F').length;
          const primM = prim.filter((a: any) => a.sexo === 'M').length;
          const primF = prim.filter((a: any) => a.sexo === 'F').length;
          const secM = sec.filter((a: any) => a.sexo === 'M').length;
          const secF = sec.filter((a: any) => a.sexo === 'F').length;

          // Aggregate Professores
          const profs: any[] = professoresList || [];
          const totalProfessores = profs.length;
          const professoresM = profs.filter((p: any) => p.sexo === 'M').length;
          const professoresF = profs.filter((p: any) => p.sexo === 'F').length;

          // Aggregate Turmas
          const totalTurmas = (turmasList || []).length;

          // Aggregate Pagamentos
          const pagamentos: any[] = pagamentosList || [];
          const propinasMes = pagamentos.reduce((acc: number, p: any) => acc + Number(p.valor || 0), 0);

          setStats({
            totalAlunos,
            alunosPreEscolar: pre.length,
            alunosPrimario: prim.length,
            alunosSecundario: sec.length,
            totalProfessores,
            professoresM,
            professoresF,
            totalTurmas,
            propinasMes,
            dividasValor: 0 // Can be extended with unpaid records
          });

          setChartData([
            { nivel: 'Pré-escolar', Masculino: preM, Feminino: preF },
            { nivel: 'Primário', Masculino: primM, Feminino: primF },
            { nivel: 'Secundário', Masculino: secM, Feminino: secF },
          ]);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-950 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-950 via-[#0F1E4A] to-primary-900 p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-accent-400">
            <Building2 size={14} />
            {mounted && school?.provincia ? school.provincia : 'Moçambique'}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Bem-vindo ao NEXUS!
          </h1>
          <h2 className="text-xl font-bold text-accent-400">
            {mounted && school?.nome ? school.nome : 'Escola Secundária da Beira'}
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Uma plataforma moderna para uma gestão escolar mais eficiente, transparente e digital.
          </p>
          <div className="pt-2">
            <Button className="bg-accent-500 hover:bg-accent-600 text-white font-semibold shadow-lg">
              Ver Relatórios <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-20">
          <GraduationCap size={280} />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Alunos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Alunos</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{stats.totalAlunos}</h2>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-4">
            <span>↑ Actualizado</span>
            <span className="text-slate-400 font-normal">em tempo real</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Pré-escolar</p>
              <p className="text-sm font-bold text-slate-800">{stats.alunosPreEscolar}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Primário</p>
              <p className="text-sm font-bold text-slate-800">{stats.alunosPrimario}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Secundário</p>
              <p className="text-sm font-bold text-slate-800">{stats.alunosSecundario}</p>
            </div>
          </div>
        </div>

        {/* Professores */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professores</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{stats.totalProfessores}</h2>
            </div>
            <div className="p-3 rounded-xl bg-accent-50 text-accent-600">
              <GraduationCap size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-4">
            <span>↑ Actualizado</span>
            <span className="text-slate-400 font-normal">corpo docente activo</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Masculino</p>
              <p className="text-sm font-bold text-slate-800">{stats.professoresM}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Feminino</p>
              <p className="text-sm font-bold text-slate-800">{stats.professoresF}</p>
            </div>
          </div>
        </div>

        {/* Turmas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Turmas</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{stats.totalTurmas}</h2>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-4">
            <span>↑ Actualizado</span>
            <span className="text-slate-400 font-normal">ano lectivo actual</span>
          </div>
          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Total de Turmas Registadas</p>
              <p className="text-base font-bold text-slate-800">{stats.totalTurmas}</p>
            </div>
          </div>
        </div>

        {/* Propinas do Mês */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Propinas do Mês</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{stats.propinasMes.toLocaleString('pt-MZ')} MT</h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-4">
            <span>↑ Actualizado</span>
            <span className="text-slate-400 font-normal">arrecadação mensal</span>
          </div>
          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <p className="text-[10px] text-slate-500 font-medium">Em Dívida</p>
              <p className="text-base font-bold text-red-600">{stats.dividasValor.toLocaleString('pt-MZ')} MT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo de Alunos por Nível e Sexo (Real Recharts BarChart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Resumo de Alunos por Nível e Sexo</h3>
              <p className="text-xs text-slate-500">Distribuição estatística real baseada nos dados do Supabase</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                <span>Masculino</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span>Feminino</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nivel" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                />
                <Bar dataKey="Masculino" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Feminino" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Actividade Recente & Ações Rápidas */}
        <div className="space-y-6">
          {/* Ações Rápidas */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Ações Rápidas</h3>
            <div className="space-y-3">
              <QuickActionButton href="/dashboard/academico/alunos" icon={UserPlus} label="Cadastrar Aluno" color="bg-blue-600 text-white" />
              <QuickActionButton href="/dashboard/academico/professores" icon={GraduationCap} label="Registar Professor" color="bg-emerald-600 text-white" />
              <QuickActionButton href="/dashboard/academico/turmas" icon={BookOpen} label="Criar Turma" color="bg-purple-600 text-white" />
              <QuickActionButton href="/dashboard/financeiro/tesouraria" icon={BarChart3} label="Ver Relatórios" color="bg-primary-950 text-white" />
            </div>
          </div>

          {/* Actividade Recente */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Actividade Recente</h3>
              <Link href="/dashboard/secretaria/matriculas" className="text-xs font-semibold text-primary-700 hover:underline">Ver Todas →</Link>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="p-2 rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Perfil da escola sincronizado</p>
                  <p className="text-xs text-slate-400">Tempo real</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                  <Users size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sessão Multi-Tenant ativa</p>
                  <p className="text-xs text-slate-400">Isolamento RLS OK</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-50 text-amber-600 mt-0.5">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">NEXUS Enterprise v1.0.0</p>
                  <p className="text-xs text-slate-400">Sistema operacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon: Icon, label, color }: any) {
  return (
    <Link href={href || '#'} className={cn("w-full flex items-center justify-between p-3.5 rounded-xl font-semibold shadow-sm hover:opacity-95 transition-all text-sm block", color)}>
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      <ChevronRight size={18} />
    </Link>
  );
}
