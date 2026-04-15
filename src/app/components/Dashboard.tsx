
"use client";

import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Radar, ArrowRight, Target, Flame, Zap, Timer } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useState, useMemo, useEffect } from 'react';

export default function Dashboard({ onStartQuiz, onOpenProtocol }: { onStartQuiz: () => void, onOpenProtocol: () => void }) {
  const { data, updateData } = useLocalData();
  const [showPlan, setShowPlan] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const lastSession = useMemo(() => {
    if (!data.sessions || data.sessions.length === 0) return null;
    return data.sessions[data.sessions.length - 1];
  }, [data.sessions]);

  const activeProtocol = useMemo(() => {
    if (!lastSession?.activeProtocolId) return null;
    return (contentData.protocolos as any)[lastSession.activeProtocolId];
  }, [lastSession]);

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
      case 'low': return 'text-success';
      case 'medium': return 'text-accent';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getLabelText = (label: string) => {
    switch (label) {
      case 'low': return 'Equilíbrio';
      case 'medium': return 'Alerta';
      case 'high': return 'Risco Crítico';
      default: return 'Sem Dados';
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
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-headline font-extrabold tracking-tight">Estratégia Detalhada</h2>
          <button 
            onClick={() => setShowPlan(false)} 
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors glass-card px-4 py-2 rounded-full"
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
                className={`p-6 rounded-3xl border transition-all duration-300 glass-card ${
                  isDone ? 'border-success/30 bg-success/5' : 'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <p className="text-[9px] text-accent font-black uppercase tracking-widest mb-1">{step.action}</p>
                    <h3 className={`font-headline font-bold text-lg leading-tight ${isDone ? 'text-success' : 'text-foreground'}`}>
                      {step.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => toggleStep(step.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-success text-success-foreground' : 'bg-white/5 text-muted-foreground'}`}
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5 italic">
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
    <div className="p-6 animate-fade-in h-full flex flex-col pb-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-headline font-black tracking-tighter">MEU RADAR</h2>
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-1">
            {lastSession ? `Sincronizado: ${new Date(lastSession.timestamp).toLocaleDateString()}` : 'Pronto para Escaneamento'}
          </p>
        </div>
        <div className="glass-card p-3 rounded-2xl shadow-xl border-accent/20">
          <Radar className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <circle cx="144" cy="144" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
            <circle 
              cx="144" 
              cy="144" 
              r="130" 
              stroke="url(#scoreGradient)" 
              strokeWidth="10" 
              fill="transparent" 
              strokeDasharray={816.8} 
              strokeDashoffset={816.8 - (816.8 * (lastSession?.score || 0)) / 100} 
              className="transition-all duration-1000 ease-out" 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-7xl font-headline font-black tracking-tighter text-foreground drop-shadow-2xl">
              {lastSession?.score || 0}<span className="text-3xl text-primary opacity-50">%</span>
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 px-3 py-1 glass-card rounded-full border-none ${getLabelColor(lastSession?.label || '')}`}>
              {getLabelText(lastSession?.label || '')}
            </span>
          </div>
        </div>

        {lastSession && (
          <div 
            onClick={onOpenProtocol}
            className="w-full mb-8 p-6 glass-card rounded-[32px] border-primary/30 flex flex-col gap-3 relative overflow-hidden group cursor-pointer animate-pulse-glow-success"
          >
            <div className="absolute -top-4 -right-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Flame className="w-24 h-24 text-success" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xs font-black text-success uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 fill-success" />
                {activeProtocol?.title ? `Protocolo: ${activeProtocol.title}` : 'Protocolo Ativado'}
              </h3>
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                <Timer className="w-3 h-3 text-success" />
                <span className="text-[10px] font-mono font-bold text-success tabular-nums">{timeLeft}</span>
              </div>
            </div>
            <p className="text-xs text-foreground/80 leading-snug font-medium relative z-10">
              {activeProtocol?.description || 'Ações de intervenção imediata para reverter o esfriamento detectado.'}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-success uppercase tracking-[0.2em] mt-2 relative z-10">
              ACESSAR AGORA <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}

        {lastSession && lastSession.weakestCategory && (
          <div className="w-full mb-6 p-5 glass-card rounded-3xl border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Ponto Crítico:</p>
              <p className="text-sm font-bold text-foreground">{(contentData.categoryInsights as any)[lastSession.weakestCategory]?.name}</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-xs text-center mb-10">
          <h3 className="font-headline font-bold text-xl mb-3 leading-tight">
            {lastSession ? contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high']?.title : 'Pronta para o Diagnóstico?'}
          </h3>
          <p className="text-xs text-muted-foreground px-6 leading-relaxed opacity-80">
            {lastSession ? 'Sua dinâmica exige uma intervenção estratégica para recuperar o valor percebido.' : 'Escaneie os padrões invisíveis que estão moldando o futuro da sua relação.'}
          </p>
        </div>

        <div className="w-full space-y-4">
          <Button onClick={onStartQuiz} className="w-full h-16 rounded-3xl font-black text-sm glow-primary transition-all active:scale-[0.98] uppercase tracking-widest bg-primary hover:bg-primary/90">
            {lastSession ? 'Refazer Análise' : 'Iniciar Escaneamento'}
          </Button>
          {lastSession && (
            <button
              onClick={() => setShowPlan(true)}
              className="w-full h-14 rounded-3xl glass-card border-white/10 hover:bg-white/5 flex items-center justify-center gap-3 transition-all group"
            >
              <span className="font-bold text-[10px] uppercase tracking-widest">Ver Laudo Completo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
