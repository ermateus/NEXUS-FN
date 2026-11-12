'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Users, TrendingUp, Monitor, Headphones, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (email === 'demo@nexus.mz' && password === 'nexus123') {
      localStorage.setItem('nexus_demo_session', 'true');
      toast.success('Entrando como utilizador de demonstração...');
      router.push('/dashboard');
      router.refresh();
      setLoading(false);
      return;
    }

    localStorage.removeItem('nexus_demo_session');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Erro ao entrar: ' + error.message);
      setLoading(false);
    } else {
      toast.success('Bem-vindo de volta!');
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error('Erro ao entrar com Google: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0A1128] text-white">
      {/* Lado Esquerdo - Hero Banner */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#0F1E4A] to-[#046A38]">
        {/* Topo Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img 
            src="/nexuserp.png" 
            alt="NEXUS Logo" 
            className="h-12 w-auto object-contain bg-transparent border-0 shadow-none p-0"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight">NEXUS Enterprise</h2>
            <p className="text-xs text-white/70">Inteligência, Conexão e Tecnologia</p>
          </div>
        </div>

        {/* Centro - Título & Badges */}
        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Educação Inteligente para um <span className="text-accent-500">Moçambique Melhor</span>
          </h1>
          <p className="text-white/80 text-base max-w-lg leading-relaxed">
            Gestão escolar moderna, segura e eficiente, em qualquer lugar.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <Shield className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Seguro</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <Users className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Multi-Tenant</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <TrendingUp className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Escalável</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <Monitor className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Responsivo</span>
            </div>
          </div>
        </div>

        {/* Rodapé do Hero */}
        <div className="flex items-center justify-between relative z-10 pt-6 border-t border-white/10 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Headphones size={18} className="text-accent-500" />
            <div>
              <p className="font-bold text-white">Suporte Técnico</p>
              <p>+258 87 602 6638 | mocambiquenexus@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-transparent text-slate-900">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img 
                src="/nexuserp.png" 
                alt="NEXUS Logo" 
                className="h-16 w-auto object-contain bg-transparent border-0 shadow-none p-0"
              />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-primary-950">
              Bem-vindo de volta!
            </h2>
            <p className="text-sm text-slate-500">
              Inicie sessão para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-500">
                    <Mail size={20} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-transparent border-slate-200 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-500">
                    <Lock size={20} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 bg-transparent border-slate-200 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right">
                  <Link
                    href="/recuperar-senha"
                    className="text-xs font-medium text-primary-700 hover:underline"
                  >
                    Esqueci a senha?
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 select-none">
                  Manter sessão iniciada
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-accent-600 hover:bg-accent-700 text-white font-semibold shadow-md transition-all text-base"
              disabled={loading}
            >
              {loading ? 'A entrar...' : 'Entrar'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/95 px-3 text-slate-400 font-medium">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium bg-transparent"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Entrar com Google
          </Button>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Acesso de Demonstração</p>
              <p className="text-[11px] text-amber-700 mb-2">Utilize os dados abaixo para explorar a plataforma sem registo:</p>
              <button 
                type="button"
                onClick={() => {
                  setEmail('demo@nexus.mz');
                  setPassword('nexus123');
                }}
                className="w-full py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-bold transition-colors border border-amber-300"
              >
                Auto-preencher: demo@nexus.mz / nexus123
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Ainda não tem uma escola no NEXUS?
            </p>
            <Link href="/registar">
              <Button
                variant="outline"
                className="w-full h-11 border-accent-600 text-accent-700 hover:bg-accent-50 font-semibold bg-transparent"
              >
                Registar a minha escola
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-slate-400 pt-4">
            NEXUS Enterprise © 2026. Todos os direitos reservados. | <span title="Moçambique" className="inline-block">🇲🇿</span> Moçambique
          </div>
        </div>
      </div>
    </div>
  );
}
