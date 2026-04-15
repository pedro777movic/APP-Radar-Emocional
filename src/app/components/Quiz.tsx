"use client";

import { useState, useCallback, useMemo } from 'react';
import { useLocalData, QuizResponse, CategorySubscore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Radar, Zap } from 'lucide-react';
import contentData from '../../../public/assets/content.json';

type QuizState = 'QUESTIONS' | 'ANALYZING' | 'RESULT';

export default function Quiz({ onComplete }: { onComplete: () => void }) {
  const { data, updateData } = useLocalData();
  const [state, setState] = useState<QuizState>('QUESTIONS');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);

  const activeQuestions = useMemo(() => {
    const pool = [...contentData.quiz.questions];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4);
  }, []);

  const calculateResult = useCallback((finalResponses: QuizResponse[]) => {
    setState('ANALYZING');

    setTimeout(() => {
      let weightedSum = 0;
      let totalWeight = 0;

      finalResponses.forEach(resp => {
        weightedSum += resp.value * resp.weight;
        totalWeight += resp.weight;
      });

      const finalScore = Math.round(weightedSum / totalWeight);
      const normalizedScore = Math.max(0, Math.min(100, finalScore));

      const categories = ['investimento', 'consistencia', 'prioridade', 'reciprocidade'];
      const subscores: CategorySubscore[] = categories.map(cat => {
        const catResponses = finalResponses.filter(r => r.category === cat);
        if (catResponses.length === 0) return { category: cat, score: -1 };

        let catSum = 0;
        let catWeight = 0;
        catResponses.forEach(r => {
          catSum += r.value * r.weight;
          catWeight += r.weight;
        });
        return { category: cat, score: Math.round(catSum / catWeight) };
      }).filter(s => s.score !== -1);

      let weakestCategory = subscores.length > 0 ? subscores[0].category : '';
      let maxCatScore = subscores.length > 0 ? subscores[0].score : 0;

      subscores.forEach(s => {
        if (s.score > maxCatScore) {
          maxCatScore = s.score;
          weakestCategory = s.category;
        }
      });

      let label: 'low' | 'medium' | 'high' = 'low';
      if (normalizedScore >= 67) label = 'high';
      else if (normalizedScore >= 34) label = 'medium';

      const session = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: Date.now(),
        score: normalizedScore,
        label,
        responses: finalResponses,
        weakestCategory,
        subscores,
        protocolStartTime: Date.now()
      };

      updateData({
        sessions: [...(data.sessions || []), session],
        completedPlanSteps: []
      });

      setState('RESULT');
    }, 3000);
  }, [data.sessions, updateData]);

  const handleAnswer = (val: number) => {
    const q = activeQuestions[currentIdx];
    let finalVal = val;
    if (q.reverse) {
      finalVal = 100 - val;
    }

    const newResponses = [
      ...responses, 
      { 
        questionId: q.id, 
        value: finalVal, 
        category: q.category, 
        weight: q.weight 
      }
    ];
    setResponses(newResponses);

    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult(newResponses);
    }
  };

  if (state === 'QUESTIONS') {
    const q = activeQuestions[currentIdx];
    const progress = ((currentIdx + 1) / activeQuestions.length) * 100;

    return (
      <div className="p-6 h-full flex flex-col animate-fade-in relative">
        <div className="flex items-center gap-5 mb-12">
          <Progress value={progress} className="h-2 flex-1 bg-white/5 overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
          </Progress>
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">{currentIdx + 1}/{activeQuestions.length}</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="glass-card p-10 rounded-[40px] border-white/5 mb-16 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/30" />
            <h2 className="text-2xl font-headline font-extrabold leading-tight text-foreground tracking-tight">
              {q.text}
            </h2>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.yes)}
              className="w-full h-16 text-md font-bold rounded-3xl glass-card border-white/10 hover:border-primary hover:bg-primary/10 transition-all active:scale-[0.98]"
            >
              Sim, com certeza
            </Button>
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.sometimes)}
              className="w-full h-16 text-md font-bold rounded-3xl glass-card border-white/10 hover:border-primary hover:bg-primary/10 transition-all active:scale-[0.98]"
            >
              Às vezes / Talvez
            </Button>
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.no)}
              className="w-full h-16 text-md font-bold rounded-3xl glass-card border-white/10 hover:border-destructive hover:bg-destructive/10 transition-all active:scale-[0.98]"
            >
              Não, raramente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-fade-in">
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
          <Radar className="w-24 h-24 text-accent relative z-10 animate-spin-slow" />
        </div>
        <h2 className="text-3xl font-headline font-black mb-4 tracking-tight uppercase">Cruzando Dados...</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground animate-pulse text-[10px] font-black uppercase tracking-[0.3em]">Identificando padrões de vácuo...</p>
          <p className="text-muted-foreground animate-pulse delay-100 text-[10px] font-black uppercase tracking-[0.3em]">Mapeando desinvestimento...</p>
          <p className="text-muted-foreground animate-pulse delay-200 text-[10px] font-black uppercase tracking-[0.3em]">Ativando Protocolos de Reação...</p>
        </div>
      </div>
    );
  }

  if (state === 'RESULT') {
    const lastSession = data.sessions[data.sessions.length - 1];
    const rangeData = contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high'];
    const categoryInsight = lastSession.weakestCategory ? (contentData.categoryInsights as any)[lastSession.weakestCategory] : null;

    return (
      <div className="p-6 h-full flex flex-col animate-slide-up text-center justify-center">
        <div className="mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
            <h1 className="text-8xl font-headline font-black text-foreground mb-2 tracking-tighter relative z-10">
              {lastSession.score}<span className="text-4xl text-primary">%</span>
            </h1>
          </div>
          <div className="inline-block px-5 py-2 glass-card rounded-full text-accent font-black uppercase tracking-widest text-[10px] border-accent/20">
            Nível: {rangeData.title}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] border-white/5 mb-6 text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Radar className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Laudo Técnico:</h3>
          <p className="text-foreground leading-relaxed text-sm font-medium mb-6 opacity-90">{rangeData.text}</p>
          
          {categoryInsight && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <span className="text-[10px] font-black bg-accent/10 text-accent px-3 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block border border-accent/20">
                Alvo: {categoryInsight.name}
              </span>
              <p className="text-xs text-muted-foreground italic leading-relaxed font-medium">"{categoryInsight.insight}"</p>
            </div>
          )}
        </div>

        <div className="p-5 glass-card rounded-3xl border-success/30 mb-8 flex items-center gap-4 bg-success/5">
          <Zap className="w-6 h-6 text-success animate-bounce" />
          <p className="text-[10px] font-black text-foreground text-left uppercase tracking-tight leading-snug">
            Seu Plano de Intervenção Estratégica foi gerado com base no seu ponto crítico.
          </p>
        </div>

        <Button 
          onClick={onComplete} 
          className="w-full h-18 text-xl font-black uppercase tracking-widest bg-success text-success-foreground hover:bg-success/90 animate-pulse-glow-success border-none rounded-[32px] py-6 shadow-2xl"
        >
          Acessar Protocolo
        </Button>
      </div>
    );
  }

  return null;
}