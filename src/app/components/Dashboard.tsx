"use client";

import { useLocalData, Session } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Radar, ArrowRight, CheckCircle2, Info, BookOpen } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Dashboard({ onStartQuiz }: { onStartQuiz: () => void }) {
  const { data, updateData } = useLocalData();
  const [showPlan, setShowPlan] = useState(false);

  const lastSession = useMemo(() => {
    if (!data.sessions || data.sessions.length === 0) return null;
    return data.sessions[data.sessions.length - 1];
  }, [data.sessions]);

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
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
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

        <div className="mt-12 p-6 bg-card rounded-2xl border border-white/5 text-center">
          <p className="text-xs text-muted-foreground italic">"O segredo do controle emocional é agir com estratégia, não com impulso."</p>
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
            <circle
              cx="128"
              cy="128"
              r="115"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-muted/20"
            />
            <circle
              cx="128"
              cy="128"
              r="115"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={722.5}
              strokeDashoffset={722.5 - (722.5 * (lastSession?.score || 0)) / 100}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-headline font-bold tracking-tighter">{lastSession?.score || 0}%</span>
            <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${getLabelColor(lastSession?.label || '')}`}>
              {getLabelText(lastSession?.label || '')}
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs text-center mb-10">
          <h3 className="font-headline font-bold text-lg mb-2">
            {lastSession ? contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high']?.title : 'Pronta para sua análise?'}
          </h3>
          <p className="text-xs text-muted-foreground px-4 leading-relaxed">
            {lastSession ? 'Sua dinâmica atual exige atenção estratégica.' : 'Entenda o que está acontecendo nos bastidores da sua relação.'}
          </p>
          
          {lastSession && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-6 flex items-center gap-2 text-[10px] text-primary font-black mx-auto hover:opacity-80 transition-opacity uppercase tracking-widest border-b border-primary/30 pb-1">
                  <Info className="w-3 h-3" />
                  SAIBA MAIS
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 max-w-[90vw] rounded-3xl overflow-y-auto max-h-[85vh] p-0 gap-0">
                <div className="p-6">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="font-headline text-2xl font-bold text-primary text-left">
                      {contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high']?.title}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-4">
                    <p>{contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high']?.text}</p>
                    
                    <div className="mt-8 pt-8 border-t border-white/5">
                      <h4 className="font-bold text-foreground flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
                        <BookOpen className="w-4 h-4 text-accent" />
                        Base Científica
                      </h4>
                      <p className="text-xs italic text-muted-foreground mb-6 bg-black/20 p-4 rounded-2xl border border-white/5">
                        {contentData.theory.explanation}
                      </p>
                      <div className="space-y-3">
                        {contentData.theory.references.map((ref, idx) => (
                          <div key={idx} className="bg-muted/10 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-foreground uppercase tracking-wider mb-1">{ref.author}</p>
                            <p className="text-[10px] text-muted-foreground leading-snug">{ref.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="w-full space-y-3">
          {lastSession && (
            <Button
              variant="outline"
              onClick={() => setShowPlan(true)}
              className="w-full h-14 rounded-2xl border-white/10 hover:bg-card flex justify-between px-6 transition-all group"
            >
              <span className="font-bold text-sm">Ver plano estratégico</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
          <Button
            onClick={onStartQuiz}
            className="w-full h-14 rounded-2xl font-black text-sm glow-primary transition-all active:scale-[0.98]"
          >
            {lastSession ? 'REFAZER ANÁLISE' : 'COMEÇAR ANÁLISE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
