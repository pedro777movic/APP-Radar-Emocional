"use client";

import { useState, useEffect } from 'react';
import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Radar, ChevronLeft } from 'lucide-react';
import contentData from '../../../public/assets/content.json';

type QuizState = 'INTRO' | 'QUESTIONS' | 'ANALYZING' | 'RESULT';

export default function Quiz({ onComplete }: { onComplete: () => void }) {
  const { data, updateData } = useLocalData();
  const [state, setState] = useState<QuizState>('QUESTIONS');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const questions = contentData.quiz.questions;

  const handleAnswer = (val: number) => {
    const newResponses = [...responses, { questionId: questions[currentIdx].id, value: val }];
    setResponses(newResponses);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult(newResponses);
    }
  };

  const calculateResult = (finalResponses: any[]) => {
    setState('ANALYZING');

    setTimeout(() => {
      const sum = finalResponses.reduce((acc, curr) => acc + curr.value, 0);
      const score = Math.round(sum / questions.length);

      let label: 'low' | 'medium' | 'high' = 'low';
      if (score >= contentData.resultRanges.high.min) label = 'high';
      else if (score >= contentData.resultRanges.medium.min) label = 'medium';

      const session = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        score,
        label,
        responses: finalResponses
      };

      updateData({
        sessions: [...data.sessions, session],
        completedPlanSteps: [] // Reset plan for new analysis
      });

      setState('RESULT');
    }, 2500);
  };

  if (state === 'QUESTIONS') {
    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="p-6 h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-xs font-medium text-muted-foreground">{currentIdx + 1}/{questions.length}</span>
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
              className="w-full h-16 text-lg rounded-2xl border-white/10 hover:border-primary/50"
            >
              Sim
            </Button>
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.sometimes)}
              variant="outline"
              className="w-full h-16 text-lg rounded-2xl border-white/10 hover:border-primary/50"
            >
              Às vezes
            </Button>
            <Button
              onClick={() => handleAnswer(contentData.quiz.answerScores.no)}
              variant="outline"
              className="w-full h-16 text-lg rounded-2xl border-white/10 hover:border-primary/50"
            >
              Não
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
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
          <p className="text-muted-foreground animate-pulse text-sm">Calculando padrão emocional...</p>
          <p className="text-muted-foreground animate-pulse delay-75 text-sm">Organizando sinais de interesse...</p>
          <p className="text-muted-foreground animate-pulse delay-150 text-sm">Mapeando reciprocidade...</p>
        </div>
      </div>
    );
  }

  if (state === 'RESULT') {
    const lastSession = data.sessions[data.sessions.length - 1];
    const rangeData = contentData.resultRanges[lastSession.label as 'low' | 'medium' | 'high'];

    return (
      <div className="p-6 h-full flex flex-col animate-slide-up text-center justify-center">
        <div className="mb-10">
          <h1 className="text-6xl font-headline font-bold text-primary mb-2">{lastSession.score}%</h1>
          <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary font-bold uppercase tracking-widest text-xs">
            {rangeData.title}
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-white/5 mb-10 text-left">
          <h3 className="font-bold mb-2">Análise:</h3>
          <p className="text-muted-foreground leading-relaxed">{rangeData.description}</p>
        </div>

        <Button onClick={onComplete} className="w-full h-16 text-lg font-bold glow-primary">
          Ver meu plano estratégico
        </Button>
        <p className="text-xs text-muted-foreground mt-6">
          Se não fizer sentido, refaça a qualquer momento.
        </p>
      </div>
    );
  }

  return null;
}
