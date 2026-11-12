'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { PROVINCES, DISTRICTS, Province } from '@/lib/data/mozambique';
import { School, Upload, Loader2, Save } from 'lucide-react';

const profileSchema = z.object({
  nome: z.string().min(3, 'Nome da escola deve ter pelo menos 3 caracteres'),
  nuit: z.string().length(9, 'NUIT deve ter exatamente 9 dígitos'),
  niveis_ensino: z.array(z.string()).min(1, 'Selecione pelo menos um nível de ensino'),
  provincia: z.string().min(1, 'Selecione uma província'),
  distrito: z.string().min(1, 'Selecione um distrito'),
  endereco: z.string().optional(),
  representante: z.string().min(3, 'Nome do representante deve ter pelo menos 3 caracteres'),
  telefone: z.string().regex(/^\+258\d{9}$/, 'Formato inválido. Use +258 seguido de 9 dígitos'),
  email: z.string().email('Email inválido'),
  logo_url: z.string().optional()
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function SchoolProfilePage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      niveis_ensino: [],
    }
  });

  const selectedProvince = watch('provincia') as Province;
  const selectedNiveis = watch('niveis_ensino');

  useEffect(() => {
    const fetchSchool = async () => {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('nexus_demo_session') === 'true';

      if (isDemo) {
        setSchoolId('demo-school');
        const savedSchool = typeof window !== 'undefined' ? localStorage.getItem('nexus_school_data') : null;
        if (savedSchool) {
          try {
            const parsed = JSON.parse(savedSchool);
            reset(parsed);
            setLoading(false);
            return;
          } catch {}
        }

        reset({
          nome: 'Escola Secundária NEXUS (Demo)',
          nuit: '400123987',
          niveis_ensino: ['Pré-escolar', 'Primário', 'Secundário'],
          provincia: 'Maputo Cidade',
          distrito: 'Distrito Municipal de KaMpfumo',
          endereco: 'Av. Samora Machel, nº 420, Bairro Central',
          representante: 'Dr. Alberto Mondlane Macamo',
          telefone: '+258843219012',
          email: 'direccao@nexus.ac.mz',
          logo_url: ''
        });
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', user.id)
          .single();

        if (profileData?.schools) {
          const s = profileData.schools;
          setSchoolId(s.id);
          reset({
            nome: s.nome,
            nuit: s.nuit,
            niveis_ensino: s.niveis_ensino,
            provincia: s.provincia,
            distrito: s.distrito,
            endereco: s.endereco || '',
            representante: s.representante,
            telefone: s.telefone,
            email: s.email,
            logo_url: s.logo_url || ''
          });
        }
      }
      setLoading(false);
    };

    fetchSchool();
  }, [supabase, reset]);

  const onSubmit = async (data: ProfileValues) => {
    setSaving(true);
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('nexus_demo_session') === 'true';

    if (isDemo) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexus_school_data', JSON.stringify(data));
      }
      setTimeout(() => {
        setSaving(false);
        toast.success('Perfil da escola actualizado com sucesso!');
      }, 400);
      return;
    }

    if (!schoolId) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('schools')
      .update({
        nome: data.nome,
        niveis_ensino: data.niveis_ensino,
        provincia: data.provincia,
        distrito: data.distrito,
        endereco: data.endereco,
        representante: data.representante,
        telefone: data.telefone,
        email: data.email,
        logo_url: data.logo_url
      })
      .eq('id', schoolId);

    if (error) {
      toast.error('Erro ao guardar alterações: ' + error.message);
    } else {
      toast.success('Perfil da escola actualizado com sucesso!');
    }
    setSaving(false);
  };

  const handleNivelToggle = (nivel: string) => {
    const current = [...selectedNiveis];
    const index = current.indexOf(nivel);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(nivel);
    }
    setValue('niveis_ensino', current, { shouldValidate: true });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-950" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Perfil da Escola</h1>
          <p className="text-slate-500">Gira as informações públicas e de contacto da sua instituição.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <Label className="block mb-4">Logótipo da Escola</Label>
            <div className="relative mx-auto w-32 h-32 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 group overflow-hidden">
              {watch('logo_url') ? (
                <img src={watch('logo_url')} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <School size={48} className="text-slate-300" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload size={24} className="text-white" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-wider">Tamanho recomendado: 512x512px</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <form className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome da Escola</Label>
                <Input id="nome" {...register('nome')} />
                {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nuit">NUIT (Apenas leitura)</Label>
                <Input id="nuit" {...register('nuit')} readOnly className="bg-slate-50 text-slate-500" />
              </div>

              <div className="space-y-2">
                <Label>Níveis de Ensino</Label>
                <div className="flex flex-wrap gap-2">
                  {['Pré-escolar', 'Primário', 'Secundário'].map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => handleNivelToggle(nivel)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedNiveis.includes(nivel)
                          ? 'bg-accent-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {nivel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provincia">Província</Label>
                <select
                  id="provincia"
                  {...register('provincia')}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito</Label>
                <select
                  id="distrito"
                  {...register('distrito')}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                >
                  {selectedProvince && DISTRICTS[selectedProvince].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input id="endereco" {...register('endereco')} />
              </div>

              <div className="border-t border-slate-100 pt-6 md:col-span-2">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Contactos & Responsável</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="representante">Nome do Representante</Label>
                <Input id="representante" {...register('representante')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" {...register('telefone')} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Oficial</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
