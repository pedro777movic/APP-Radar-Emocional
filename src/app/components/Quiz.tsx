"use client";

import { useState, useCallback } from 'react';
import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Radar } from 'lucide-react';
import contentData from '../../../public/assets/content.json';

type QuizState = 'QUESTIONS' | 'ANALYZING' | 'RESULT';

export default function Quiz({ onComplete }: { onComplete: () => void }) {
  const { data, updateData } = useLocalData();
  const [state, setState] = useState<QuizState>('QUESTIONS');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const questions = contentData.quiz.questions;

  const calculateResult = useCallback((finalResponses: any[]) => {
    setState('ANALYZING');

    setTimeout(() => {
      if (questions.length === 0) return;

      const sum = finalResponses.reduce((acc, curr) => acc + curr.value, 0);
      // Garante que o score fique entre 0 e 100
      let score = Math.round(sum / questions.length);
      score = Math.max(0, Math.min(100, score));

      let label: 'low' | 'medium' | 'high' = 'low';
      if (score >= 67) label = 'high';
      else if (score >= 34) label = 'medium';

      const session = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: Date.now(),
        score,
        label,
        responses: finalResponses
      };

      updateData({
        sessions: [...(data.sessions || []), session],
        completedPlanSteps: []
      });

      setState('RESULT');
    }, 2500);
  }, [data.sessions, updateData, questions.length]);

  const handleAnswer = (val: number) => {
    const newResponses = [...responses, { questionId: questions[currentIdx].id, value: val }];
    setResponses(newResponses);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult(newResponses);
    }
  };

  if (state === 'QUESTIONS') {
    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="p-6 h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{currentIdx + 1}/{questions.length}</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-card p-8 rounded-3xl border border-white/5 glass-card mb-12 shadow-2xl">
            <h2 className="text-2xl font-headline font-bold leading-tight text-center">
              {q.text}
            </h2>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.yes)}
              variant="outline"
              className="w-full h-16 text-lg rounded-2xl border-white/10 hover:border-primary/50 transition-all active:scale-[0.98]"
            >
              Sim
            </Button>
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.sometimes)}
              variant="outline"
              className="w-full h-16 text-lg rounded-2xl border-white/10 hover:border-primary/50 transition-all active:scale-[0.98]"
            >
              Às vezes
            </Button>
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.no)}
              variant="outline"
              className="w-full h-16 text-lg rounded-2xl border-white/10 hover:border-primary/50 transition-all active:scale-[0.98]"
            >
              Não
            </Button>
          </div>
        </div>
        <p className="text-center text-[10px] font-bold text-muted-foreground mt-8 uppercase tracking-widest">
          Seja honesta consigo mesma para um resultado preciso.
        </p>
      </div>
    );
  }

  if (state === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <Radar className="w-20 h-20 text-primary relative z-10 animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-headline font-bold mb-4">Radar ativado...</h2>
        <div className="space-y-2">
          <p className="text-muted-foreground animate-pulse text-xs font-bold uppercase tracking-widest">Calculando padrão emocional...</p>
          <p className="text-muted-foreground animate-pulse delay-75 text-xs font-bold uppercase tracking-widest">Organizando sinais de interesse...</p>
          <p className="text-muted-foreground animate-pulse delay-150 text-xs font-bold uppercase tracking-widest">Mapeando reciprocidade...</p>
        </div>
      </div>
    );
  }

  if (state === 'RESULT') {
    const lastSession = data.sessions[data.sessions.length - 1];
    const rangeData = contentData.expandedResults[lastSession.label as 'low' | 'medium' | 'high'];

    return (
      <div className="p-6 h-full flex flex-col animate-slide-up text-center justify-center">
        <div className="mb-10">
          <h1 className="text-7xl font-headline font-bold text-primary mb-2 tracking-tighter">{lastSession.score}%</h1>
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-black uppercase tracking-widest text-[10px] border border-primary/20">
            {rangeData.title}
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-white/5 mb-10 text-left shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Análise Estratégica:</h3>
          <p className="text-muted-foreground leading-relaxed text-sm font-medium">{rangeData.text}</p>
        </div>

        <Button 
          onClick={onComplete} 
          className="w-full h-16 text-lg font-black glow-primary uppercase tracking-widest"
        >
          Ver meu plano estratégico
        </Button>
        <p className="text-[10px] text-muted-foreground mt-8 font-bold uppercase tracking-widest opacity-50">
          Se não fizer sentido, refaça a qualquer momento.
        </p>
      </div>
    );
  }

  return null;
}
