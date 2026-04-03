
"use client";

import { useLocalData, Session } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Radar, ArrowRight, CheckCircle2, Info, BookOpen, Target, Flame, Zap } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Dashboard({ onStartQuiz, onOpenProtocol }: { onStartQuiz: () => void, onOpenProtocol: () => void }) {
  const { data, updateData } = useLocalData();
  const [showPlan, setShowPlan] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const lastSession = useMemo(() => {
    if (!data.sessions || data.sessions.length === 0) return null;
    return data.sessions[data.sessions.length - 1];
  }, [data.sessions]);

  useEffect(() => {
    if (!lastSession?.protocolStartTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const end = lastSession.protocolStartTime! + 24 * 60 * 60 * 1000;
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastSession]);

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-primary';
      case 'high': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getLabelText = (label: string) => {
    switch (label) {
      case 'low': return 'Equilíbrio';
      case 'medium': return 'Atenção';
      case 'high': return 'Alto Risco';
      default: return 'Desconhecido';
    }
  };

  const toggleStep = (stepId: string) => {
    const currentSteps = data.completedPlanSteps || [];
    const isDone = currentSteps.includes(stepId);
    if (isDone) {
      updateData({ completedPlanSteps: currentSteps.filter(s => s !== stepId) });
    } else {
      updateData({ completedPlanSteps: [...currentSteps, stepId] });
    }
  };

  if (lastSession && showPlan) {
    const plan = contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high']?.plan || [];
    return (
      <div className="p-6 animate-slide-up pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-headline font-bold">Seu Plano</h2>
          <button 
            onClick={() => setShowPlan(false)} 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar
          </button>
        </div>

        <div className="space-y-4">
          {plan.map((step) => {
            const isDone = (data.completedPlanSteps || []).includes(step.id);
            return (
              <div
                key={step.id}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  isDone ? 'bg-primary/5 border-primary/20' : 'bg-card border-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-4">
                    <h3 className={`font-headline font-bold text-sm ${isDone ? 'text-primary' : 'text-foreground'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">{step.action}</p>
                  </div>
                  <button 
                    onClick={() => toggleStep(step.id)}
                    className={`p-1 rounded-full transition-colors ${isDone ? 'text-primary' : 'text-muted-foreground/30 hover:text-muted-foreground/50'}`}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in radar-gradient h-full flex flex-col pb-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-headline font-bold">Meu Radar</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            {lastSession ? `Última análise: ${new Date(lastSession.timestamp).toLocaleDateString()}` : 'Nenhuma análise'}
          </p>
        </div>
        <div className="bg-card p-2.5 rounded-xl border border-white/5 shadow-lg">
          <Radar className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative w-64 h-64 mb-10">
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse-glow"></div>
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted/20" />
            <circle cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={722.5} strokeDashoffset={722.5 - (722.5 * (lastSession?.score || 0)) / 100} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-headline font-bold tracking-tighter">{lastSession?.score || 0}%</span>
            <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${getLabelColor(lastSession?.label || '')}`}>
              {getLabelText(lastSession?.label || '')}
            </span>
          </div>
        </div>

        {lastSession && lastSession.weakestCategory && (
          <div className="w-full mb-4 p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center gap-4">
            <Target className="w-6 h-6 text-accent shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Ponto mais crítico:</p>
              <p className="text-xs font-medium text-foreground">{(contentData.categoryInsights as any)[lastSession.weakestCategory]?.name}</p>
            </div>
          </div>
        )}

        {lastSession && (
          <div className="w-full mb-8 p-5 bg-primary/10 rounded-2xl border border-primary/20 flex flex-col gap-3 relative overflow-hidden group cursor-pointer" onClick={onOpenProtocol}>
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
              <Flame className="w-12 h-12 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                <Zap className="w-4 h-4 fill-primary" />
                Protocolo de Reação Ativado
              </h3>
              <span className="text-[10px] font-mono font-bold text-primary tabular-nums">{timeLeft}</span>
            </div>
            <p className="text-[11px] text-foreground leading-tight">
              Ações imediatas recomendadas para o seu nível de esfriamento.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
              ACESSAR AGORA <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}

        <div className="w-full max-w-xs text-center mb-10">
          <h3 className="font-headline font-bold text-lg mb-2">
            {lastSession ? contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high']?.title : 'Pronta para sua análise?'}
          </h3>
          <p className="text-xs text-muted-foreground px-4 leading-relaxed">
            {lastSession ? 'Sua dinâmica exige uma intervenção estratégica imediata.' : 'Entenda o que está acontecendo nos bastidores da sua relação.'}
          </p>
        </div>

        <div className="w-full space-y-3">
          {lastSession && (
            <Button
              variant="outline"
              onClick={() => setShowPlan(true)}
              className="w-full h-14 rounded-2xl border-white/10 hover:bg-card flex justify-between px-6 transition-all group"
            >
              <span className="font-bold text-sm">Ver análise detalhada</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
          <Button onClick={onStartQuiz} className="w-full h-14 rounded-2xl font-black text-sm glow-primary transition-all active:scale-[0.98]">
            {lastSession ? 'REFAZER RADAR' : 'COMEÇAR ANÁLISE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
