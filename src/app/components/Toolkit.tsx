
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Play, Lock } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useToast } from '@/hooks/use-toast';

export default function Toolkit() {
  const { toast } = useToast();
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  // Fallbacks de segurança para evitar crash caso as chaves não existam no JSON
  const templates = contentData.messageTemplates || (contentData as any).templates || {};
  const audioScripts = contentData.audioScripts || [];
  const templateKeys = Object.keys(templates);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    toast({
      description: "Copiado para a área de transferência!",
    });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (templateKeys.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <p className="text-muted-foreground">Carregando ferramentas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-headline font-bold">Toolkit</h2>
        <p className="text-sm text-muted-foreground">Templates prontos para agir com clareza.</p>
      </div>

      <Tabs defaultValue={templateKeys[0]} className="w-full">
        <TabsList className="grid grid-cols-4 bg-muted/30 p-1 h-12 mb-6">
          {templateKeys.map(key => (
            <TabsTrigger key={key} value={key} className="text-[10px] uppercase font-bold tracking-tighter">
              {key}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(templates).map(([key, messages]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {(messages as string[]).map((msg, idx) => (
              <div
                key={idx}
                onClick={() => copyToClipboard(msg, `${key}-${idx}`)}
                className="p-4 glass-card rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">"{msg}"</p>
                  <div className="shrink-0 pt-1">
                    {copiedIdx === `${key}-${idx}` ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 mb-8">
        <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
          Áudios Estratégicos
          <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-black">PREMIUM</span>
        </h3>
        <div className="space-y-3">
          {audioScripts.map((audio: any) => (
            <div key={audio.id} className="p-4 glass-card rounded-2xl border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  {audio.premium ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold">{audio.title}</p>
                  <p className="text-[10px] text-muted-foreground">30-45 segundos</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest">BLOQUEADO</button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Check className="w-12 h-12 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-primary mb-2 flex items-center gap-2 text-sm uppercase tracking-widest">
          Dica de Ouro
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium relative z-10">
          Use os templates como ponto de partida. O segredo é manter a mensagem curta e não demonstrar ansiedade por uma resposta. O silêncio estratégico é uma ferramenta de poder.
        </p>
      </div>
    </div>
  );
}
