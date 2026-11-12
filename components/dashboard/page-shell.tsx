'use client';

import { Plus, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  onExport?: () => void;
  onWhatsApp?: () => void;
  showExport?: boolean;
  showWhatsApp?: boolean;
  extraActions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  onExport,
  onWhatsApp,
  showExport = true,
  showWhatsApp = false,
  extraActions
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        {extraActions}
        {showExport && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport || (() => window.print())}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="mr-2 h-4 w-4 text-slate-500" /> Exportar / Imprimir
          </Button>
        )}
        {showWhatsApp && onWhatsApp && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onWhatsApp}
            className="border-emerald-500 text-emerald-700 hover:bg-emerald-50 shadow-sm"
          >
            <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" /> WhatsApp
          </Button>
        )}
        {actionLabel && (
          <Button 
            size="sm" 
            onClick={onAction}
            className="bg-primary-950 hover:bg-primary-900 text-white font-medium shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function EmptyTable({ message = "Nenhum registo encontrado." }: { message?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center mb-3">
        <MessageSquare size={20} />
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
