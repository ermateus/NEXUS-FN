'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Wallet, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
  ChevronDown,
  School,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  items?: { title: string; href: string }[];
}

const MENU_ITEMS: NavItem[] = [
  { title: 'Painel Principal', href: '/dashboard', icon: LayoutDashboard },
  { 
    title: 'ACADÉMICO', 
    href: '/dashboard/academico', 
    icon: BookOpen,
    items: [
      { title: 'Alunos', href: '/dashboard/academico/alunos' },
      { title: 'Professores', href: '/dashboard/academico/professores' },
      { title: 'Turmas', href: '/dashboard/academico/turmas' },
    ]
  },
  { 
    title: 'SECRETARIA', 
    href: '/dashboard/secretaria', 
    icon: FileText,
    items: [
      { title: 'Matrículas', href: '/dashboard/secretaria/matriculas' },
      { title: 'Declarações', href: '/dashboard/secretaria/declaracoes' },
    ]
  },
  { 
    title: 'FINANCEIRO', 
    href: '/dashboard/financeiro', 
    icon: Wallet,
    items: [
      { title: 'Tesouraria', href: '/dashboard/financeiro/tesouraria' },
      { title: 'Propinas', href: '/dashboard/financeiro/propinas' },
      { title: 'Dívidas', href: '/dashboard/financeiro/dividas' },
    ]
  },
  { 
    title: 'COMUNICAÇÃO', 
    href: '/dashboard/comunicacao', 
    icon: MessageSquare,
    items: [
      { title: 'Portal Encarregados', href: '/dashboard/comunicacao/portal' },
      { title: 'IA Chat', href: '/dashboard/comunicacao/ai' },
    ]
  },
  { title: 'SISTEMA', href: '/dashboard/configuracoes', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Demo bypass check
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('nexus_demo_session') === 'true';

      if (!user && !isDemo) {
        router.push('/login');
        return;
      }

      if (isDemo) {
        setProfile({ nome: 'Gestor Demo', id: 'demo-user' });
        setSchool({ nome: 'Escola Secundária NEXUS (Demo)', id: 'demo-school', provincia: 'Maputo' });
        return;
      }

      setUser(user);

      // Fetch profile and school
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, schools(*)')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setSchool(profileData.schools);
      }
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    localStorage.removeItem('nexus_demo_session');
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary-950 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !sidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img 
                src="/nexuserp.png" 
                alt="NEXUS Logo" 
                className="h-10 w-auto object-contain bg-transparent border-0 shadow-none p-0"
              />
              <span className="text-lg font-bold tracking-tight">NEXUS</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
            {MENU_ITEMS.map((item) => (
              <div key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? "bg-accent-500 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={18} />
                  {item.title}
                </Link>
                {item.items && (pathname === item.href || pathname.startsWith(item.href + '/')) && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block px-3 py-1.5 text-xs rounded-md transition-colors",
                          pathname === sub.href
                            ? "text-white font-semibold"
                            : "text-white/50 hover:text-white"
                        )}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
              <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold uppercase">
                {mounted && school?.nome ? school.nome.substring(0, 2) : 'EX'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{mounted && school?.nome ? school.nome : 'Carregando...'}</p>
                <p className="text-[10px] text-white/50 truncate">ID: {mounted && school?.id ? school.id.substring(0, 8) : '...'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className={cn("p-2 rounded-md hover:bg-slate-100 lg:hidden", sidebarOpen && "hidden")}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h2 className="text-sm font-medium text-slate-500">
                {pathname === '/dashboard' ? 'Painel Principal' : pathname.split('/').slice(2).join(' / ').toUpperCase()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-semibold text-slate-900">{mounted && profile?.nome ? profile.nome : 'Carregando...'}</p>
              <p className="text-xs text-slate-500">Admin Escola</p>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold uppercase border border-primary-200">
                  {profile?.nome?.substring(0, 1) || <User size={20} />}
                </div>
                <ChevronDown size={14} className={cn("text-slate-500 transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{profile?.nome}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        href="/dashboard/configuracoes/perfil" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <School size={16} />
                        Perfil da Escola
                      </Link>
                      <Link 
                        href="/dashboard/perfil" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} />
                        O meu perfil
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Sair do Sistema
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
