
"use client";

import { useState, useCallback, useMemo } from 'react';
import { useLocalData, QuizResponse, CategorySubscore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Radar } from 'lucide-react';
import contentData from '../../../public/assets/content.json';

type QuizState = 'QUESTIONS' | 'ANALYZING' | 'RESULT';

export default function Quiz({ onComplete }: { onComplete: () => void }) {
  const { data, updateData } = useLocalData();
  const [state, setState] = useState<QuizState>('QUESTIONS');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);

  // Seleciona 4 perguntas aleatórias do banco de 12
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
      // 1. Cálculo do Score Total Ponderado
      let weightedSum = 0;
      let totalWeight = 0;

      finalResponses.forEach(resp => {
        weightedSum += resp.value * resp.weight;
        totalWeight += resp.weight;
      });

      const finalScore = Math.round(weightedSum / totalWeight);
      const normalizedScore = Math.max(0, Math.min(100, finalScore));

      // 2. Cálculo de Subscores por Categoria
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

      // 3. Identificar Categoria Crítica (maior risco proporcional)
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
        subscores
      };

      updateData({
        sessions: [...(data.sessions || []), session],
        completedPlanSteps: []
      });

      setState('RESULT');
    }, 2500);
  }, [data.sessions, updateData]);

  const handleAnswer = (val: number) => {
    const q = activeQuestions[currentIdx];
    
    // Se a pergunta for "reversa", o score deve ser invertido
    // No nosso JSON, Sim=100 significa ALTO RISCO. 
    // Se a pergunta for "Ele inclui você em planos?", Sim é BOM (baixo risco).
    // Logo, se reverse=true, Sim (100) vira 0, e Não (0) vira 100.
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
      <div className="p-6 h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{currentIdx + 1}/{activeQuestions.length}</span>
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
          O motor psicológico está analisando suas respostas em tempo real.
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
        <h2 className="text-2xl font-headline font-bold mb-4">Motor Ativado...</h2>
        <div className="space-y-2">
          <p className="text-muted-foreground animate-pulse text-xs font-bold uppercase tracking-widest">Calculando pesos categoriais...</p>
          <p className="text-muted-foreground animate-pulse delay-75 text-xs font-bold uppercase tracking-widest">Mapeando sub-dimensões...</p>
          <p className="text-muted-foreground animate-pulse delay-150 text-xs font-bold uppercase tracking-widest">Cruzando variáveis de risco...</p>
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
        <div className="mb-6">
          <h1 className="text-7xl font-headline font-bold text-primary mb-2 tracking-tighter">{lastSession.score}%</h1>
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-black uppercase tracking-widest text-[10px] border border-primary/20">
            {rangeData.title}
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-white/5 mb-4 text-left shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Diagnóstico Adaptativo:</h3>
          <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">{rangeData.text}</p>
          
          {categoryInsight && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-[10px] font-black bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-tighter mb-2 inline-block">Foco Crítico: {categoryInsight.name}</span>
              <p className="text-xs text-muted-foreground italic leading-relaxed">{categoryInsight.insight}</p>
            </div>
          )}
        </div>

        <Button 
          onClick={onComplete} 
          className="w-full h-16 text-lg font-black glow-primary uppercase tracking-widest"
        >
          Ver meu plano estratégico
        </Button>
      </div>
    );
  }

  return null;
}
