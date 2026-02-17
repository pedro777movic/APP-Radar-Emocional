"use client";

import { Button } from '@/components/ui/button';
import { Trash2, Shield, Info, ArrowLeft, RefreshCw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function SettingsPage({ onBack, onDataClear }: { onBack: () => void, onDataClear: () => void }) {
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-card p-2 rounded-xl border border-white/5">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-headline font-bold">Ajustes</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Privacidade</label>
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <Shield className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Dados Localmente</p>
                <p className="text-[10px] text-muted-foreground">Tudo fica no seu celular.</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors text-left">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">Apagar todos os dados</p>
                    <p className="text-[10px] text-muted-foreground">Essa ação não pode ser desfeita.</p>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-white/10 max-w-[90vw] rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-headline">Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Isso apagará permanentemente seu histórico de análises, PIN e progresso do plano local.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel className="rounded-2xl border-white/10 hover:bg-white/5">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDataClear} className="bg-destructive hover:bg-destructive/90 rounded-2xl">Confirmar e Apagar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Informações</label>
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <RefreshCw className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Versão 1.0.0</p>
                <p className="text-[10px] text-muted-foreground">Seu app está atualizado.</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <Info className="w-5 h-5 text-pink" />
              <div className="flex-1">
                <p className="text-sm font-medium">Radar Emocional</p>
                <p className="text-[10px] text-muted-foreground">Análise estratégica de relações.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-xs text-muted-foreground">Radar Emocional © 2024</p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">Desenvolvido com foco em privacidade total.</p>
      </div>
    </div>
  );
}
