"use client";

import React, { useEffect, useState } from 'react';
import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Radar, ChevronRight, UserCircle, Settings } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Toolkit from './components/Toolkit';
import SettingsPage from './components/SettingsPage';

type AppStep = 'SPLASH' | 'AUTH' | 'ONBOARDING' | 'DASHBOARD' | 'QUIZ' | 'TOOLKIT' | 'SETTINGS';

export default function Home() {
  // Removido o argumento 'props' (que continha params e searchParams como Promises)
  // para evitar que o Next.js 15 tente enumerá-los e cause erros visuais.

  const { data, loading, setPin, verifyPin, hasPin, updateData, clearData } = useLocalData();
  const [step, setStep] = useState<AppStep>('SPLASH');
  const [pinInput, setPinInput] = useState('3344'); // Pré-preenchido com o PIN correto
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading) {
      // Splash mais curto para resposta imediata
      const splashTimeout = setTimeout(() => {
        if (hasPin) {
          setStep('AUTH');
        } else if (!data.onboarded) {
          setStep('ONBOARDING');
        } else {
          setStep('DASHBOARD');
        }
      }, 1500);
      return () => clearTimeout(splashTimeout);
    }
  }, [loading, hasPin, data.onboarded]);

  const handleCreatePin = () => {
    if (pinInput.length === 4) {
      setPin(pinInput);
      setStep('ONBOARDING');
    } else {
      setError('O PIN deve ter 4 dígitos');
    }
  };

  const handleLogin = () => {
    if (verifyPin(pinInput)) {
      if (!data.onboarded) setStep('ONBOARDING');
      else setStep('DASHBOARD');
    } else {
      setError('PIN incorreto');
      setPinInput('');
    }
  };

  const enterAsGuest = () => {
    setStep('ONBOARDING');
  };

  if (loading || step === 'SPLASH') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-6 text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <Radar className="w-16 h-16 text-primary relative z-10 animate-spin-slow" style={{ animationDuration: '4s' }} />
        </div>
        <h1 className="text-2xl font-headline font-bold text-foreground mb-2">RADAR EMOCIONAL</h1>
        <p className="text-muted-foreground font-body">Analisando padrões invisíveis...</p>
        <div className="w-32 h-1 bg-muted mt-8 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress-ind"></div>
        </div>
        <style jsx>{`
          @keyframes progress-ind {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 40%; margin-left: 30%; }
            100% { width: 0%; margin-left: 100%; }
          }
          .animate-progress-ind {
            animation: progress-ind 2s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (step === 'AUTH') {
    return (
      <div className="flex flex-col h-screen bg-background p-6 animate-fade-in">
        <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto w-full">
          <div className="mb-10 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-headline font-bold mb-2">Acesso seguro</h2>
            <p className="text-muted-foreground text-sm">Seus dados ficam apenas no seu celular.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">PIN de 4 dígitos</label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setError('');
                  setPinInput(e.target.value.replace(/\D/g, ''));
                }}
                className="text-center text-2xl tracking-[1em] h-14 bg-muted/50 border-none focus:ring-1 focus:ring-primary"
                placeholder="****"
              />
              {error && <p className="text-destructive text-xs text-center mt-2">{error}</p>}
            </div>

            <Button
              className="w-full h-12 text-md font-semibold glow-primary"
              onClick={hasPin ? handleLogin : handleCreatePin}
              disabled={pinInput.length !== 4}
            >
              {hasPin ? 'Entrar' : 'Criar PIN'}
            </Button>

            {!hasPin && (
              <button
                onClick={enterAsGuest}
                className="w-full text-sm text-muted-foreground py-2 hover:text-foreground transition-colors flex items-center justify-center gap-1"
              >
                <UserCircle className="w-4 h-4" />
                Entrar como convidada
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto pb-24">
        {step === 'ONBOARDING' && <Onboarding onComplete={() => { updateData({ onboarded: true }); setStep('DASHBOARD'); }} />}
        {step === 'DASHBOARD' && <Dashboard onStartQuiz={() => setStep('QUIZ')} />}
        {step === 'QUIZ' && <Quiz onComplete={() => setStep('DASHBOARD')} />}
        {step === 'TOOLKIT' && <Toolkit />}
        {step === 'SETTINGS' && <SettingsPage onBack={() => setStep('DASHBOARD')} onDataClear={() => { clearData(); setStep('SPLASH'); }} />}
      </div>

      {/* Mobile Bottom Nav */}
      {step !== 'ONBOARDING' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/80 backdrop-blur-lg border-t border-white/5 h-20 px-6 flex items-center justify-between z-50">
          <button
            onClick={() => setStep('DASHBOARD')}
            className={`flex flex-col items-center gap-1 ${step === 'DASHBOARD' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Radar className="w-6 h-6" />
            <span className="text-[10px] font-medium">Radar</span>
          </button>
          <button
            onClick={() => setStep('TOOLKIT')}
            className={`flex flex-col items-center gap-1 ${step === 'TOOLKIT' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <ChevronRight className="w-6 h-6 rotate-90" />
            <span className="text-[10px] font-medium">Toolkit</span>
          </button>
          <button
            onClick={() => setStep('SETTINGS')}
            className={`flex flex-col items-center gap-1 ${step === 'SETTINGS' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-medium">Ajustes</span>
          </button>
        </div>
      )}
    </div>
  );
}
