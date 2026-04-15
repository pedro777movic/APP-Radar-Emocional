import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Radar Emocional',
  description: 'Análise estratégica de padrões invisíveis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
        <div className="fixed inset-0 grid-bg pointer-events-none opacity-20" />
        <main className="min-h-screen max-w-md mx-auto relative overflow-hidden flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}