'use client';

import { PageHeader } from '@/components/dashboard/page-shell';
import { Settings, School, Shield, Bell, Database } from 'lucide-react';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  const sections = [
    { 
      title: 'Perfil da Escola', 
      desc: 'Informações básicas, logótipo e contactos.', 
      icon: School, 
      href: '/dashboard/configuracoes/perfil' 
    },
    { 
      title: 'Segurança & Utilizadores', 
      desc: 'Gira quem tem acesso ao sistema e respectivos papéis.', 
      icon: Shield, 
      href: '/dashboard/perfil' 
    },
    { 
      title: 'Notificações & Modelos', 
      desc: 'Configure templates de email, pré-visualização e alertas.', 
      icon: Bell, 
      href: '/dashboard/configuracoes/notificacoes' 
    },
    { 
      title: 'Auditoria & Tesouraria', 
      desc: 'Histórico de lançamentos contábeis e exportações oficiais.', 
      icon: Database, 
      href: '/dashboard/financeiro/tesouraria' 
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações do Sistema" 
        description="Personalize o funcionamento do NEXUS para a sua escola."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((s) => (
          <Link 
            key={s.title} 
            href={s.href}
            className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <div className="p-3 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
              <s.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
