
"use client";

import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Check, Flame, Zap, Clock, Info, ShieldCheck, Target } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProtocoloReacao({ onBack }: { onBack: () => void }) {
  const { data } = useLocalData();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      description: "Script tático copiado com sucesso!",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!lastSession || !activeProtocol) return (
    <div className="p-6 flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-xl font-bold mb-4">Nenhum protocolo ativo</h2>
      <Button onClick={onBack}>Voltar</Button>
    </div>
  );

  return (
    <div className="p-6 animate-slide-up pb-24 h-full overflow-y-auto">
      <div className="flex items-center gap-5 mb-10">
        <button onClick={onBack} className="glass-card p-3 rounded-2xl border-white/10 hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5 text-accent" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <h2 className="text-xl font-headline font-black tracking-tight uppercase">{activeProtocol.title}</h2>
          </div>
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em]">Intervenção Adaptativa</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-[32px] mb-8 border-accent/20">
        <p className="text-xs text-foreground/80 leading-relaxed italic font-medium">
          "{activeProtocol.description}"
        </p>
      </div>

      <div className="glass-card p-6 rounded-[32px] mb-10 flex items-center justify-between relative overflow-hidden group border-success/20">
        <div className="absolute inset-0 bg-success/5 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-success/20 p-3 rounded-2xl">
            <Clock className="w-6 h-6 text-success animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-black text-success uppercase tracking-widest">Janela de Reação:</p>
            <p className="text-2xl font-headline font-black text-foreground tabular-nums leading-none mt-1">{timeLeft}</p>
          </div>
        </div>
        <Flame className="w-10 h-10 text-success/30 relative z-10" />
      </div>

      <Tabs defaultValue="24h" className="w-full">
        <TabsList className="grid grid-cols-3 glass-card p-1.5 h-16 mb-10 border-white/5">
          <TabsTrigger value="24h" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Ações 24h</TabsTrigger>
          <TabsTrigger value="scripts" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Scripts</TabsTrigger>
          <TabsTrigger value="3dias" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Plano 3D</TabsTrigger>
        </TabsList>

        <TabsContent value="24h" className="space-y-5 animate-fade-in">
          <div className="mb-8 px-2">
            <h3 className="font-headline font-black text-xl mb-2 tracking-tight uppercase">Choque Tático</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Ações personalizadas para sua situação de {lastSession.weakestCategory}.</p>
          </div>
          {activeProtocol.acoes_24h.map((step: any, idx: number) => (
            <div key={idx} className="p-6 glass-card rounded-[32px] border-white/5 flex gap-5 transition-all hover:border-accent/20">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-black text-sm shrink-0 border border-accent/20">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-md font-bold text-foreground mb-2 leading-tight">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="scripts" className="space-y-5 animate-fade-in">
          <div className="mb-8 px-2">
            <h3 className="font-headline font-black text-xl mb-2 tracking-tight uppercase">Adaptados</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Mensagens específicas para o padrão detectado no seu Radar.</p>
          </div>
          {activeProtocol.scripts.map((script: any) => (
            <div 
              key={script.id} 
              onClick={() => copyToClipboard(script.texto, script.id)}
              className="p-6 glass-card rounded-[32px] border-white/5 hover:border-success/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[9px] font-black text-success uppercase tracking-widest bg-success/10 px-3 py-1.5 rounded-full border border-success/20">{script.categoria}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-all group-hover:bg-success group-hover:text-success-foreground">
                  {copiedId === script.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
              <p className="text-md font-medium leading-relaxed italic mb-5 text-foreground/90 bg-black/40 p-4 rounded-2xl border border-white/5">"{script.texto}"</p>
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal font-medium">{script.instrucao}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="3dias" className="space-y-8 animate-fade-in">
          <div className="mb-8 px-2">
            <h3 className="font-headline font-black text-xl mb-2 tracking-tight uppercase">Cronograma</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Roteiro tático de 72 horas para reposicionamento de valor.</p>
          </div>
          <div className="relative pl-10 space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:to-accent before:opacity-30">
            {activeProtocol.plano_3dias.map((dia: any) => (
              <div key={dia.dia} className="relative">
                <div className="absolute -left-[30px] top-0 w-10 h-10 rounded-2xl bg-background border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(157,0,255,0.4)]">
                  <span className="text-xs font-black text-primary">{dia.dia}</span>
                </div>
                <div className="p-6 glass-card rounded-[32px] border-white/5">
                  <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">DIA {dia.dia}: {dia.titulo}</h4>
                  <p className="text-sm text-foreground font-bold mb-4 leading-snug">{dia.acao}</p>
                  <div className="flex flex-wrap gap-2">
                    {dia.detalhes.map((det: string, i: number) => (
                      <span key={i} className="text-[9px] bg-white/5 px-3 py-1.5 rounded-xl text-muted-foreground border border-white/5 font-medium">
                        {det}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 p-8 glass-card rounded-[40px] border-accent/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Zap className="w-16 h-16 text-accent" />
        </div>
        <h3 className="font-headline font-black text-accent mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
          Mentalidade Blindada
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
          {activeProtocol.mentalidade}
        </p>
      </div>
    </div>
  );
}
