
"use client";

import { useLocalData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Check, Flame, Zap, Timer, Calendar } from 'lucide-react';
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
      description: "Script copiado com sucesso!",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!lastSession) return null;

  return (
    <div className="p-6 animate-slide-up pb-24 h-full overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-card p-2 rounded-xl border border-white/5">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-headline font-bold">Protocolo V3</h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">Intervenção Estratégica</p>
        </div>
      </div>

      <div className="bg-primary/10 p-5 rounded-3xl border border-primary/20 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-[0_0_15px_rgba(30,111,255,0.4)]">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Expira em:</p>
            <p className="text-xl font-headline font-bold text-foreground tabular-nums leading-none mt-0.5">{timeLeft}</p>
          </div>
        </div>
        <Flame className="w-8 h-8 text-primary animate-pulse" />
      </div>

      <Tabs defaultValue="24h" className="w-full">
        <TabsList className="grid grid-cols-3 bg-muted/30 p-1 h-12 mb-6 rounded-2xl">
          <TabsTrigger value="24h" className="text-[10px] font-bold uppercase rounded-xl">Plano 24h</TabsTrigger>
          <TabsTrigger value="scripts" className="text-[10px] font-bold uppercase rounded-xl">Scripts</TabsTrigger>
          <TabsTrigger value="3dias" className="text-[10px] font-bold uppercase rounded-xl">3 Dias</TabsTrigger>
        </TabsList>

        <TabsContent value="24h" className="space-y-4">
          <div className="mb-4">
            <h3 className="font-headline font-bold text-lg">Ações Imediatas</h3>
            <p className="text-xs text-muted-foreground">Siga estes passos nas próximas 24 horas.</p>
          </div>
          {contentData.protocolo_24h.map((step, idx) => (
            <div key={idx} className="p-4 bg-card rounded-2xl border border-white/5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-1">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="scripts" className="space-y-4">
          <div className="mb-4">
            <h3 className="font-headline font-bold text-lg">Biblioteca Copy-Paste</h3>
            <p className="text-xs text-muted-foreground">Toque para copiar o script ideal para cada situação.</p>
          </div>
          {contentData.scripts_copy_paste.map((script) => (
            <div 
              key={script.id} 
              onClick={() => copyToClipboard(script.texto, script.id)}
              className="p-5 bg-card rounded-3xl border border-white/5 hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">{script.categoria}</span>
                {copiedId === script.id ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
              </div>
              <p className="text-sm font-medium leading-relaxed italic mb-3">"{script.texto}"</p>
              <div className="flex items-start gap-2 pt-3 border-t border-white/5">
                <Info className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-tight">{script.instrução}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="3dias" className="space-y-4">
          <div className="mb-4">
            <h3 className="font-headline font-bold text-lg">Plano de Resgate</h3>
            <p className="text-xs text-muted-foreground">Cronograma tático de 3 dias para recuperar o valor.</p>
          </div>
          {contentData.plano_resgate_3dias.map((dia) => (
            <div key={dia.dia} className="p-5 bg-card rounded-3xl border border-white/5 flex gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                <Calendar className="w-16 h-16" />
              </div>
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] font-black text-muted-foreground uppercase">DIA</span>
                <span className="text-3xl font-headline font-bold text-primary">{dia.dia}</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">{dia.titulo}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{dia.acao}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 bg-accent/5 rounded-3xl border border-accent/10">
        <h3 className="font-headline font-bold text-accent mb-2 flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4" />
          Mindset de Controle
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          O Protocolo V3 não é sobre manipular, mas sobre recuperar sua dignidade emocional. Quando você retira seu investimento, o outro percebe o vácuo e o valor do que está perdendo. Mantenha a disciplina.
        </p>
      </div>
    </div>
  );
}
