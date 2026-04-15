"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Radar, UserCircle, Settings } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Toolkit from './components/Toolkit';
import SettingsPage from './components/SettingsPage';
import ProtocoloReacao from './components/ProtocoloReacao';

type AppStep = 'SPLASH' | 'AUTH' | 'ONBOARDING' | 'DASHBOARD' | 'QUIZ' | 'TOOLKIT' | 'SETTINGS' | 'PROTOCOLO';

export default function Home() {
  const { data, loading, verifyPin, hasPin, updateData, clearData } = useLocalData();
  const [step, setStep] = useState<AppStep>('SPLASH');
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && step === 'SPLASH') {
      const splashTimeout = setTimeout(() => {
        if (hasPin) {
          setStep('AUTH');
        } else if (!data.onboarded) {
          setStep('ONBOARDING');
        } else {
          setStep('DASHBOARD');
        }
      }, 2000);
      return () => clearTimeout(splashTimeout);
    }
  }, [loading, hasPin, data.onboarded, step]);

  const handleLogin = useCallback(() => {
    setError('');
    if (pinInput.length < 4) {
      setError('Digite o PIN de 4 dígitos');
      return;
    }
    if (verifyPin(pinInput)) {
      if (!data.onboarded) setStep('ONBOARDING');
      else setStep('DASHBOARD');
      setPinInput('');
    } else {
      setError('PIN incorreto');
      setPinInput('');
    }
  }, [pinInput, verifyPin, data.onboarded]);

  const enterAsGuest = () => {
    updateData({ onboarded: true });
    setStep('DASHBOARD');
  };

  const handleFullReset = () => {
    clearData();
    setPinInput('');
    setError('');
    setStep('SPLASH');
  };

  if (loading || step === 'SPLASH') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-6 text-center animate-fade-in relative">
        <div className="absolute inset-0 radar-scan opacity-20" />
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full scale-150 animate-pulse"></div>
          <Radar className="w-24 h-24 text-primary relative z-10 animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-foreground mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          RADAR EMOCIONAL
        </h1>
        <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.2em] font-medium opacity-70">
          Escaneando Frequências...
        </p>
        <div className="w-48 h-1 bg-white/5 mt-10 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-loading-bar"></div>
        </div>
        <style jsx>{`
          @keyframes loading-bar {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 100%; transform: translateX(0); }
            100% { width: 0%; transform: translateX(100%); }
          }
          .animate-loading-bar {
            animation: loading-bar 2.5s infinite cubic-bezier(0.65, 0, 0.35, 1);
          }
        `}</style>
      </div>
    );
  }

  if (step === 'AUTH') {
    return (
      <div className="flex flex-col h-screen bg-background p-6 animate-fade-in">
        <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto w-full">
          <div className="mb-12 text-center">
            <div className="glass-card w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all" />
              <ShieldCheck className="w-10 h-10 text-accent relative z-10" />
            </div>
            <h2 className="text-3xl font-headline font-bold mb-3 tracking-tight">Acesso Seguro</h2>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">Seus dados e protocolos são 100% privados.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">PIN de 4 dígitos</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setError('');
                  const val = e.target.value.replace(/\D/g, '');
                  setPinInput(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pinInput.length === 4) handleLogin();
                }}
                className="text-center text-3xl font-headline tracking-[0.8em] h-16 glass-card border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="****"
              />
              {error && <p className="text-destructive text-[10px] text-center mt-3 font-black uppercase tracking-widest animate-pulse">{error}</p>}
            </div>

            <Button
              className="w-full h-16 text-lg font-extrabold uppercase tracking-widest bg-success text-success-foreground hover:bg-success/90 animate-pulse-glow-success border-none"
              onClick={handleLogin}
              disabled={pinInput.length !== 4}
            >
              Desbloquear
            </Button>

            {!data.onboarded && (
              <button
                onClick={enterAsGuest}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4 hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                Acesso Convidada
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
        {step === 'DASHBOARD' && <Dashboard onStartQuiz={() => setStep('QUIZ')} onOpenProtocol={() => setStep('PROTOCOLO')} />}
        {step === 'QUIZ' && <Quiz onComplete={() => setStep('DASHBOARD')} />}
        {step === 'TOOLKIT' && <Toolkit />}
        {step === 'PROTOCOLO' && <ProtocoloReacao onBack={() => setStep('DASHBOARD')} />}
        {step === 'SETTINGS' && (
          <SettingsPage 
            onBack={() => setStep('DASHBOARD')} 
            onDataClear={handleFullReset} 
          />
        )}
      </div>

      {step !== 'ONBOARDING' && step !== 'QUIZ' && step !== 'PROTOCOLO' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-card border-t border-white/10 h-20 px-10 flex items-center justify-between z-50 rounded-none">
          <button
            onClick={() => setStep('DASHBOARD')}
            className={`flex flex-col items-center gap-1.5 transition-all ${step === 'DASHBOARD' ? 'text-accent scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Radar className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Radar</span>
          </button>
          <button
            onClick={() => setStep('TOOLKIT')}
            className={`flex flex-col items-center gap-1.5 transition-all ${step === 'TOOLKIT' ? 'text-accent scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20 -mt-8 glass-card">
              <UserCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">Central</span>
          </button>
          <button
            onClick={() => setStep('SETTINGS')}
            className={`flex flex-col items-center gap-1.5 transition-all ${step === 'SETTINGS' ? 'text-accent scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Ajustes</span>
          </button>
        </div>
      )}
    </div>
  );
}