import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'NEXUS Enterprise – Sistema Integrado de Gestão Escolar',
  description: 'Sistema ERP Multi-Tenant para gestão escolar completa em Moçambique.',
  openGraph: {
    title: 'NEXUS Enterprise',
    description: 'Sistema Integrado de Gestão Escolar para Moçambique.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Enterprise',
    description: 'Sistema Integrado de Gestão Escolar para Moçambique.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ" className={`${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
