"use client";

import { Button } from '@/components/ui/button';
import { Shield, Timer, Sparkles } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const items = [
    { icon: <Shield className="w-5 h-5 text-primary" />, title: "100% Privado", desc: "Suas respostas nunca saem deste aparelho." },
    { icon: <Timer className="w-5 h-5 text-accent" />, title: "3 Minutos", desc: "Uma análise rápida que gera clareza imediata." },
    { icon: <Sparkles className="w-5 h-5 text-pink" />, title: "Plano Prático", desc: "Sugestões de ações reais para o seu momento." }
  ];

  return (
    <div className="flex flex-col h-full p-6 justify-center animate-fade-in">
      <div className="mb-12">
        <h2 className="text-3xl font-headline font-bold mb-4">Bem-vinda ao seu Radar.</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vamos analisar os padrões invisíveis da sua relação e devolver o controle emocional para as suas mãos.
        </p>
      </div>

      <div className="space-y-8 mb-16">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="bg-card p-3 rounded-xl border border-white/5">
              {item.icon}
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onComplete} className="w-full h-14 text-lg font-bold glow-primary">
        Começar agora
      </Button>
    </div>
  );
}
