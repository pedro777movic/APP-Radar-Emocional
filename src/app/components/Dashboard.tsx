"use client";

import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Radar, ArrowRight, CheckCircle2 } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useState } from 'react';

export default function Dashboard({ onStartQuiz }: { onStartQuiz: () => void }) {
  const { data, updateData } = useLocalData();
  const lastSession = data.sessions[data.sessions.length - 1];
  const [showPlan, setShowPlan] = useState(false);

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-primary';
      case 'high': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const toggleStep = (stepId: string) => {
    const isDone = data.completedPlanSteps.includes(stepId);
    if (isDone) {
      updateData({ completedPlanSteps: data.completedPlanSteps.filter(s => s !== stepId) });
    } else {
      updateData({ completedPlanSteps: [...data.completedPlanSteps, stepId] });
    }
  };

  if (lastSession && showPlan) {
    const plan = contentData.plans[lastSession.label as 'low' | 'medium' | 'high'];
    return (
      <div className="p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-headline font-bold">Seu Plano</h2>
          <button onClick={() => setShowPlan(false)} className="text-sm text-muted-foreground">Voltar</button>
        </div>

        <div className="space-y-4">
          {plan.map((step) => {
            const isDone = data.completedPlanSteps.includes(step.id);
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isDone ? 'bg-primary/5 border-primary/20' : 'bg-card border-white/5 hover:border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-headline font-bold ${isDone ? 'text-primary' : 'text-foreground'}`}>
                    {step.title}
                  </h3>
                  {isDone && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.action}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-card rounded-2xl border border-white/5 text-center">
          <p className="text-sm text-muted-foreground italic">"O segredo do controle emocional é agir com estratégia, não com impulso."</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in radar-gradient h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-headline font-bold">Meu Radar</h2>
          <p className="text-xs text-muted-foreground">Última análise: {lastSession ? new Date(lastSession.timestamp).toLocaleDateString() : 'Nenhuma'}</p>
        </div>
        <div className="bg-card p-2 rounded-xl border border-white/5">
          <Radar className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="relative w-64 h-64 mb-10">
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse-glow"></div>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/20"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * (lastSession?.score || 0)) / 100}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-headline font-bold">{lastSession?.score || 0}%</span>
            <span className={`text-sm font-medium ${getLabelColor(lastSession?.label || '')}`}>
              {lastSession ? (lastSession.label === 'low' ? 'Equilíbrio' : lastSession.label === 'medium' ? 'Médio' : 'Alto') : 'Desconhecido'}
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs text-center mb-10">
          <h3 className="font-headline font-semibold mb-2">
            {lastSession ? 'Desequilíbrio detectado' : 'Pronta para sua análise?'}
          </h3>
          <p className="text-sm text-muted-foreground px-4">
            {lastSession ? 'Seu padrão atual exige atenção estratégica.' : 'Entenda o que está acontecendo nos bastidores da sua relação.'}
          </p>
        </div>

        <div className="w-full space-y-3">
          {lastSession && (
            <Button
              variant="outline"
              onClick={() => setShowPlan(true)}
              className="w-full h-14 rounded-2xl border-white/10 hover:bg-card flex justify-between px-6"
            >
              <span>Ver plano estratégico</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={onStartQuiz}
            className="w-full h-14 rounded-2xl font-bold glow-primary"
          >
            {lastSession ? 'Refazer análise' : 'Começar análise'}
          </Button>
        </div>
      </div>
    </div>
  );
}
