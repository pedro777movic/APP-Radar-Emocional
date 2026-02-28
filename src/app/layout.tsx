import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Radar Emocional',
  description: 'Análise de padrões invisíveis e equilíbrio emocional',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  // Unwrapping params even if not used to satisfy Next.js 15 requirements
  await params;

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
        <main className="min-h-screen max-w-md mx-auto relative overflow-hidden flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
