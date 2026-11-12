'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Users, TrendingUp, Monitor, Headphones, ArrowLeft, Loader2, Info, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { PROVINCES, DISTRICTS, Province } from '@/lib/data/mozambique';
import { registerSchool } from './actions';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z.object({
  schoolName: z.string().min(3, 'Nome da escola deve ter pelo menos 3 caracteres'),
  nuit: z.string().length(9, 'NUIT deve ter exatamente 9 dígitos').regex(/^\d+$/, 'NUIT deve conter apenas números'),
  niveisEnsino: z.array(z.string()).min(1, 'Selecione pelo menos um nível de ensino'),
  provincia: z.string().min(1, 'Selecione uma província'),
  distrito: z.string().min(1, 'Selecione um distrito'),
  endereco: z.string().min(3, 'Insira a avenida, rua ou bairro'),
  representante: z.string().min(3, 'Nome do representante deve ter pelo menos 3 caracteres'),
  telefone: z.string().regex(/^\+258\d{9}$/, 'Formato inválido. Use +258 seguido de 9 dígitos'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      niveisEnsino: [], // Desmarcado por padrão conforme solicitado
      telefone: '+258',
    }
  });

  const selectedProvince = watch('provincia') as Province;
  const selectedNiveis = watch('niveisEnsino');

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    const result = await registerSchool(data);
    
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Escola registada com sucesso!');
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleNivelToggle = (nivel: string) => {
    const current = [...selectedNiveis];
    const index = current.indexOf(nivel);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(nivel);
    }
    setValue('niveisEnsino', current, { shouldValidate: true });
  };

  const handleGoogleRegister = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error('Erro ao registar com Google: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0A1128] text-white">
      {/* Lado Esquerdo - Hero Banner */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#0F1E4A] to-[#046A38] shrink-0">
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

        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Registe a sua Escola <br />no <span className="text-accent-500">NEXUS</span>
          </h1>
          <p className="text-white/80 text-base max-w-lg leading-relaxed">
            Junte-se à nossa plataforma e tenha uma gestão escolar moderna, segura e eficiente.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <Shield className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Dados seguros</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <Users className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Acesso em qualquer lugar</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <TrendingUp className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Gestão eficiente</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <Monitor className="text-accent-500" size={20} />
              <span className="text-sm font-medium">Educação de qualidade</span>
            </div>
          </div>
        </div>

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

      {/* Lado Direito - Formulário de Registo */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12 bg-transparent text-slate-900">
        <div className="w-full max-w-3xl space-y-8 rounded-2xl bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                Registo da Escola
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Preencha os dados abaixo para criar a sua conta e começar a utilizar o NEXUS.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 flex items-center gap-2 border-slate-200 bg-transparent"
              onClick={handleGoogleRegister}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome da Escola */}
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-xs font-semibold text-slate-700">
                  Nome da Escola *
                </Label>
                <Input
                  id="schoolName"
                  placeholder="Ex.: Escola Secundária da Beira"
                  {...register('schoolName')}
                  className="h-11 bg-transparent border-slate-200"
                />
                {errors.schoolName && <p className="text-xs text-red-500">{errors.schoolName.message}</p>}
              </div>

              {/* Avenida/Rua/Bairro */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-xs font-semibold text-slate-700">
                  Avenida/Rua/Bairro *
                </Label>
                <Input
                  id="endereco"
                  placeholder="Ex.: Av. Eduardo Mondlane, Bairro Central"
                  {...register('endereco')}
                  className="h-11 bg-transparent border-slate-200"
                />
                {errors.endereco && <p className="text-xs text-red-500">{errors.endereco.message}</p>}
              </div>

              {/* NUIT */}
              <div className="space-y-2">
                <Label htmlFor="nuit" className="text-xs font-semibold text-slate-700">
                  NUIT * (9 dígitos)
                </Label>
                <Input
                  id="nuit"
                  placeholder="Ex.: 400123456"
                  maxLength={9}
                  {...register('nuit')}
                  className="h-11 bg-transparent border-slate-200"
                />
                {errors.nuit && <p className="text-xs text-red-500">{errors.nuit.message}</p>}
              </div>

              {/* Nome do Representante */}
              <div className="space-y-2">
                <Label htmlFor="representante" className="text-xs font-semibold text-slate-700">
                  Nome do Representante *
                </Label>
                <Input
                  id="representante"
                  placeholder="Ex.: João Alberto Sitoe"
                  {...register('representante')}
                  className="h-11 bg-transparent border-slate-200"
                />
                {errors.representante && <p className="text-xs text-red-500">{errors.representante.message}</p>}
              </div>

              {/* Nível de Ensino */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold text-slate-700">
                  Nível de Ensino *
                </Label>
                <div className="flex flex-wrap gap-6 pt-2">
                  {['Pré-escolar', 'Primário', 'Secundário'].map((nivel) => (
                    <label key={nivel} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedNiveis.includes(nivel)}
                        onChange={() => handleNivelToggle(nivel)}
                        className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
                      />
                      <span className="text-sm font-medium text-slate-700">{nivel}</span>
                    </label>
                  ))}
                </div>
                {errors.niveisEnsino && <p className="text-xs text-red-500">{errors.niveisEnsino.message}</p>}
              </div>

              {/* Província */}
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-xs font-semibold text-slate-700">
                  Província *
                </Label>
                <select
                  id="provincia"
                  {...register('provincia')}
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                >
                  <option value="">Selecione a província</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.provincia && <p className="text-xs text-red-500">{errors.provincia.message}</p>}
              </div>

              {/* Contacto Telefónico */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-xs font-semibold text-slate-700">
                  Contacto Telefónico *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium pointer-events-none text-sm">+258</span>
                  <Input
                    id="telefone"
                    placeholder="84 123 4567"
                    {...register('telefone', {
                      onChange: (e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.startsWith('258')) val = val.slice(3);
                        setValue('telefone', '+258' + val.slice(0, 9));
                      }
                    })}
                    className="h-11 bg-transparent border-slate-200 pl-14"
                  />
                </div>
                {errors.telefone && <p className="text-xs text-red-500">{errors.telefone.message}</p>}
              </div>

              {/* Distrito */}
              <div className="space-y-2">
                <Label htmlFor="distrito" className="text-xs font-semibold text-slate-700">
                  Distrito *
                </Label>
                <select
                  id="distrito"
                  {...register('distrito')}
                  disabled={!selectedProvince}
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:opacity-50"
                >
                  <option value="">Selecione primeiro a província</option>
                  {selectedProvince && DISTRICTS[selectedProvince].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.distrito && <p className="text-xs text-red-500">{errors.distrito.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Email * (será o seu login)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@escola.mz"
                  {...register('email')}
                  className="h-11 bg-transparent border-slate-200"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Criar Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Criar Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mín. 8 caracteres"
                    {...register('password')}
                    className="h-11 bg-transparent border-slate-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                  Confirmar Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    {...register('confirmPassword')}
                    className="h-11 bg-transparent border-slate-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/80 backdrop-blur-sm border border-blue-100 text-blue-800 text-sm">
              <Info size={20} className="shrink-0 text-blue-600" />
              <span>Após o registo, a sua escola será criada como um tenant seguro e terá acesso imediato ao sistema.</span>
            </div>

            {/* Bottom Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" type="button" className="w-full h-11 border-slate-300 bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Login
                </Button>
              </Link>

              <Button 
                type="submit" 
                className="w-full sm:w-auto h-11 px-8 bg-accent-600 hover:bg-accent-700 text-white font-semibold shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A criar escola...
                  </>
                ) : (
                  'Registar a Minha Escola'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
