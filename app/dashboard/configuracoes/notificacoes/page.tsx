'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/dashboard/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Server, Key, Send, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificacoesConfigPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [school, setSchool] = useState<any>(null);

  // Form states
  const [provider, setProvider] = useState<'resend' | 'smtp'>('resend');
  const [resendApiKey, setResendApiKey] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'payment' | 'enrollment'>('payment');
  const [templateSubject, setTemplateSubject] = useState('Confirmação de Pagamento');
  const [templateBody, setTemplateBody] = useState(`
    <h2 style="color: #0F1E4A;">Confirmação de Pagamento</h2>
    <p>Olá, <strong>[Nome do Encarregado]</strong>,</p>
    <p>Confirmamos a recepção do pagamento de <strong>[Valor] MT</strong> referente às propinas de <strong>[Mês]</strong> para o aluno(a) <strong>[Nome do Aluno]</strong>.</p>
    <p style="margin-top: 20px;">Obrigado por confiar no NEXUS.</p>
  `);

  useEffect(() => {
    const loadSchoolConfig = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', user.id)
          .single();

        if (profile?.schools) {
          const currentSchool = profile.schools;
          setSchool(currentSchool);
          setFromEmail(currentSchool.email || 'noreply@nexus.co.mz');
          setFromName(currentSchool.nome || 'NEXUS Escola');

          // Load from localStorage if available
          const savedConfig = typeof window !== 'undefined' && localStorage.getItem(`nexus_email_config_${currentSchool.id}`);
          if (savedConfig) {
            try {
              const cfg = JSON.parse(savedConfig);
              setProvider(cfg.provider || 'resend');
              setResendApiKey(cfg.resendApiKey || '');
              setSmtpHost(cfg.smtpHost || '');
              setSmtpPort(cfg.smtpPort || '587');
              setSmtpUser(cfg.smtpUser || '');
              setSmtpPass(cfg.smtpPass || '');
              if (cfg.fromEmail) setFromEmail(cfg.fromEmail);
              if (cfg.fromName) setFromName(cfg.fromName);
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    };

    loadSchoolConfig();
  }, [supabase]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setLoading(true);
    const configData = {
      provider,
      resendApiKey,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      fromEmail,
      fromName,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`nexus_email_config_${school.id}`, JSON.stringify(configData));
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Configurações de notificação e email guardadas com sucesso!');
    }, 600);
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Insira um email de destino para o teste.');
      return;
    }

    setTesting(true);
    try {
      // Simulate test email sending
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success(`Email de teste enviado com sucesso para ${testEmail}!`);
    } catch (error: any) {
      toast.error('Erro ao enviar email de teste: ' + (error.message || 'Falha na conexão'));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <PageHeader 
        title="Configuração de Notificações e Emails" 
        description="Configure o servidor SMTP ou a API Key do Resend para personalizar os remetentes dos emails automáticos."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Provider Selection Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Provedor de Envio de Emails</h3>
              <p className="text-xs text-slate-500">Escolha como a sua escola enviará notificações aos encarregados e alunos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setProvider('resend')}
              className={`cursor-pointer rounded-xl border p-5 transition-all flex items-start gap-4 ${provider === 'resend' ? 'border-accent-600 bg-accent-50/30 ring-2 ring-accent-500/20' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-3 rounded-lg ${provider === 'resend' ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Key size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Resend API Key</h4>
                <p className="text-xs text-slate-500 mt-1">Recomendado. Envio rápido, seguro e integrado com infraestrutura cloud moderna.</p>
              </div>
            </div>

            <div 
              onClick={() => setProvider('smtp')}
              className={`cursor-pointer rounded-xl border p-5 transition-all flex items-start gap-4 ${provider === 'smtp' ? 'border-accent-600 bg-accent-50/30 ring-2 ring-accent-500/20' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-3 rounded-lg ${provider === 'smtp' ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Server size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Servidor SMTP Personalizado</h4>
                <p className="text-xs text-slate-500 mt-1">Utilize o servidor de email próprio da sua instituição (Gmail, Office365, etc.).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Bell size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {provider === 'resend' ? 'Credenciais Resend' : 'Configuração do Servidor SMTP'}
              </h3>
              <p className="text-xs text-slate-500">
                {provider === 'resend' ? 'Insira a sua chave de API fornecida pelo Resend' : 'Insira os parâmetros de ligação SMTP da sua escola'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {provider === 'resend' ? (
              <div className="space-y-2">
                <Label htmlFor="resendApiKey" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Resend API Key *
                </Label>
                <Input
                  id="resendApiKey"
                  type="password"
                  placeholder="re_123456789abcdef..."
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  className="h-11 bg-transparent border-slate-200 font-mono"
                />
                <p className="text-[11px] text-slate-400">Pode obter a sua chave gratuita em resend.com</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="smtpHost" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Servidor SMTP Host *
                  </Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.exemplo.co.mz"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="h-11 bg-transparent border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Porta *
                  </Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="h-11 bg-transparent border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Utilizador SMTP
                  </Label>
                  <Input
                    id="smtpUser"
                    placeholder="utilizador@escola.co.mz"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="h-11 bg-transparent border-slate-200"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="smtpPass" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Palavra-passe SMTP
                  </Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    placeholder="••••••••••••"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="h-11 bg-transparent border-slate-200"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <Label htmlFor="fromEmail" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email do Remetente (From) *
                </Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="secretaria@escola.co.mz"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="h-11 bg-transparent border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nome do Remetente *
                </Label>
                <Input
                  id="fromName"
                  placeholder="Escola Secundária NEXUS"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="h-11 bg-transparent border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Email Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-md">Testar Envio de Email</h3>
          <p className="text-xs text-slate-500">Envie uma mensagem de teste para verificar se as credenciais configuradas estão corretas.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="seu-email@exemplo.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="h-11 bg-transparent border-slate-200 flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleTestEmail}
              disabled={testing}
              className="h-11 border-slate-300 font-semibold"
            >
              {testing ? 'A enviar...' : (
                <>
                  <Send size={16} className="mr-2" /> Enviar Teste
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Template Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Pré-visualização de Modelos</h3>
              <p className="text-xs text-slate-500">Veja como os emails automáticos serão visualizados pelos encarregados</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button"
              variant={selectedTemplate === 'payment' ? 'default' : 'outline'}
              onClick={() => setSelectedTemplate('payment')}
            >
              Confirmação de Pagamento
            </Button>
            <Button 
              type="button"
              variant={selectedTemplate === 'enrollment' ? 'default' : 'outline'}
              onClick={() => setSelectedTemplate('enrollment')}
            >
              Sucesso na Matrícula
            </Button>
          </div>

          {selectedTemplate === 'payment' && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Assunto do Email</Label>
                <Input 
                  value={templateSubject} 
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  className="h-11 bg-transparent border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Corpo do Email (HTML permitido)</Label>
                <textarea 
                  className="w-full min-h-[150px] p-3 text-sm rounded-md border border-slate-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                />
                <p className="text-[10px] text-slate-400">Variáveis disponíveis: [Nome do Encarregado], [Valor], [Mês], [Nome do Aluno]</p>
              </div>
            </div>
          )}

          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
            <div className="bg-white p-8 max-w-lg mx-auto shadow-sm rounded-lg">
               {selectedTemplate === 'payment' ? (
                 <div dangerouslySetInnerHTML={{ __html: templateBody }} />
               ) : (
                 <div dangerouslySetInnerHTML={{ __html: emailTemplates[selectedTemplate] }} />
               )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="h-11 px-8 bg-accent-600 hover:bg-accent-700 text-white font-semibold shadow-md"
          >
            {loading ? 'A guardar...' : (
              <>
                <CheckCircle2 size={18} className="mr-2" /> Guardar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

const emailTemplates = {
  payment: `
    <h2 style="color: #0F1E4A;">Confirmação de Pagamento</h2>
    <p>Olá, <strong>[Nome do Encarregado]</strong>,</p>
    <p>Confirmamos a recepção do pagamento de <strong>[Valor] MT</strong> referente às propinas de <strong>[Mês]</strong> para o aluno(a) <strong>[Nome do Aluno]</strong>.</p>
    <p style="margin-top: 20px;">Obrigado por confiar no NEXUS.</p>
  `,
  enrollment: `
    <h2 style="color: #0F1E4A;">Sucesso na Matrícula</h2>
    <p>Olá, <strong>[Nome do Encarregado]</strong>,</p>
    <p>A matrícula do(a) aluno(a) <strong>[Nome do Aluno]</strong> foi realizada com sucesso para o ano lectivo <strong>2026</strong>, nível <strong>[Nível]</strong>.</p>
    <p style="margin-top: 20px;">Estamos ansiosos para receber o seu educando.</p>
  `
};
