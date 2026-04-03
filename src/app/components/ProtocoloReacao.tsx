
"use client";

import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Check, Flame, Zap, Timer, Calendar, Info, ShieldCheck, Clock } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProtocoloReacao({ onBack }: { onBack: () => void }) {
  const { data } = useLocalData();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const lastSession = data.sessions[data.sessions.length - 1];

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
      description: "Script tático copiado!",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!lastSession) return null;

  return (
    <div className="p-6 animate-slide-up pb-24 h-full overflow-y-auto radar-gradient">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-card p-2 rounded-xl border border-white/5">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-primary mb-0.5">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-xl font-headline font-bold">Protocolo V3</h2>
          </div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Intervenção Estratégica</p>
        </div>
      </div>

      <div className="bg-primary/10 p-5 rounded-3xl border border-primary/20 mb-8 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-2xl shadow-[0_0_20px_rgba(30,111,255,0.4)]">
            <Clock className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Janela de Reação:</p>
            <p className="text-xl font-headline font-bold text-foreground tabular-nums leading-none mt-1">{timeLeft}</p>
          </div>
        </div>
        <Flame className="w-8 h-8 text-primary/50" />
      </div>

      <Tabs defaultValue="24h" className="w-full">
        <TabsList className="grid grid-cols-3 bg-muted/30 p-1 h-14 mb-8 rounded-2xl border border-white/5">
          <TabsTrigger value="24h" className="text-[10px] font-bold uppercase rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Ações 24h</TabsTrigger>
          <TabsTrigger value="scripts" className="text-[10px] font-bold uppercase rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Scripts</TabsTrigger>
          <TabsTrigger value="3dias" className="text-[10px] font-bold uppercase rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Plano 3D</TabsTrigger>
        </TabsList>

        <TabsContent value="24h" className="space-y-4 animate-fade-in">
          <div className="mb-6 ml-1">
            <h3 className="font-headline font-bold text-lg">Choque de Realidade</h3>
            <p className="text-xs text-muted-foreground">Siga rigorosamente estas ações para retomar o controle.</p>
          </div>
          {contentData.protocolo_24h.map((step, idx) => (
            <div key={idx} className="p-5 bg-card rounded-3xl border border-white/5 flex gap-4 transition-all hover:bg-white/[0.02]">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="scripts" className="space-y-4 animate-fade-in">
          <div className="mb-6 ml-1">
            <h3 className="font-headline font-bold text-lg">Biblioteca Copy-Paste</h3>
            <p className="text-xs text-muted-foreground">Toque para copiar. Use as 'armas' no momento certo.</p>
          </div>
          {contentData.scripts_copy_paste.map((script) => (
            <div 
              key={script.id} 
              onClick={() => copyToClipboard(script.texto, script.id)}
              className="p-5 bg-card rounded-3xl border border-white/5 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{script.categoria}</span>
                {copiedId === script.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
              </div>
              <p className="text-sm font-medium leading-relaxed italic mb-4 text-foreground/90">"{script.texto}"</p>
              <div className="flex items-start gap-2 pt-4 border-t border-white/5">
                <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-snug">{script.instrução}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="3dias" className="space-y-6 animate-fade-in">
          <div className="mb-6 ml-1">
            <h3 className="font-headline font-bold text-lg">Protocolo de Resgate</h3>
            <p className="text-xs text-muted-foreground">Mapa tático para resetar a percepção de valor.</p>
          </div>
          <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
            {contentData.plano_resgate_3dias.map((dia) => (
              <div key={dia.dia} className="relative">
                <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_10px_rgba(30,111,255,0.3)]">
                  <span className="text-[8px] font-black text-primary">{dia.dia}</span>
                </div>
                <div className="p-5 bg-card rounded-3xl border border-white/5">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Dia {dia.dia}: {dia.titulo}</h4>
                  <p className="text-xs text-foreground font-medium mb-3 leading-relaxed">{dia.acao}</p>
                  <div className="flex flex-wrap gap-2">
                    {dia.detalhes.map((det, i) => (
                      <span key={i} className="text-[9px] bg-white/5 px-2 py-1 rounded-lg text-muted-foreground border border-white/5">
                        • {det}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 bg-accent/5 rounded-3xl border border-accent/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="w-12 h-12 text-accent" />
        </div>
        <h3 className="font-headline font-bold text-accent mb-2 flex items-center gap-2 text-sm">
          Mindset de Controle
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Este plano não é sobre manipulação, mas sobre **Dignidade Emocional**. Ao retirar seu investimento, você cria um vácuo que força o outro a reavaliar sua importância. Mantenha a disciplina. O silêncio é sua arma mais forte.
        </p>
      </div>
    </div>
  );
}
