'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { User, Mail, Shield, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function UserProfilePage() {
  const [nome, setNome] = useState('Gestor Escolar');
  const [email, setEmail] = useState('demo@nexus.mz');
  const [cargo, setCargo] = useState('Director Geral / Administrador');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const loadProfile = async () => {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('nexus_demo_session') === 'true';
      if (isDemo) {
        const savedName = localStorage.getItem('nexus_profile_name') || 'Gestor Demo';
        setNome(savedName);
        setEmail('demo@nexus.mz');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile?.nome) {
          setNome(profile.nome);
        }
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('O nome completo não pode estar vazio.');
      return;
    }

    if (senhaNova && senhaNova !== senhaConfirm) {
      toast.error('A confirmação da nova senha não coincide.');
      return;
    }

    setSaving(true);
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('nexus_demo_session') === 'true';

    if (isDemo) {
      localStorage.setItem('nexus_profile_name', nome);
      setTimeout(() => {
        setSaving(false);
        setSenhaNova('');
        setSenhaConfirm('');
        toast.success('Perfil de utilizador guardado com sucesso!');
      }, 500);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ nome }).eq('id', user.id);
        if (senhaNova) {
          await supabase.auth.updateUser({ password: senhaNova });
        }
      }
      toast.success('Perfil actualizado com sucesso no Supabase!');
    } catch (err: any) {
      toast.error('Erro ao actualizar: ' + err.message);
    } finally {
      setSaving(false);
      setSenhaNova('');
      setSenhaConfirm('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader 
        title="O meu Perfil" 
        description="Gira as suas credenciais de acesso e informações pessoais."
        showExport={false}
      />

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6 bg-slate-50/50">
          <div className="h-20 w-20 rounded-2xl bg-primary-950 flex items-center justify-center text-white font-extrabold text-3xl shadow-sm">
            {nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{nome}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-50 text-accent-700 border border-accent-200">
              <Shield size={12} /> {cargo}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="perf-nome">Nome Completo *</Label>
              <Input 
                id="perf-nome"
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perf-email">Endereço de Email (Apenas Leitura)</Label>
              <Input 
                id="perf-email"
                value={email} 
                disabled 
                className="bg-slate-50 text-slate-500 font-mono text-xs" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield size={16} className="text-primary-950" /> Segurança & Alteração de Senha
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="perf-p1">Nova Senha</Label>
                <Input 
                  id="perf-p1"
                  type="password" 
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  placeholder="Mínimo 6 caracteres" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perf-p2">Confirmar Nova Senha</Label>
                <Input 
                  id="perf-p2"
                  type="password" 
                  value={senhaConfirm}
                  onChange={(e) => setSenhaConfirm(e.target.value)}
                  placeholder="Repita a nova senha" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-primary-950 hover:bg-primary-900 text-white font-medium"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Guardar Alterações
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
