"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import contentData from '../../../public/assets/content.json';
import { useToast } from '@/hooks/use-toast';

export default function Toolkit() {
  const { toast } = useToast();
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    toast({
      description: "Copiado para a área de transferência!",
    });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-headline font-bold">Toolkit</h2>
        <p className="text-sm text-muted-foreground">Templates prontos para agir com clareza.</p>
      </div>

      <Tabs defaultValue="Curiosidade" className="w-full">
        <TabsList className="grid grid-cols-3 bg-muted/30 p-1 h-12 mb-6">
          {Object.keys(contentData.messageTemplates).map(key => (
            <TabsTrigger key={key} value={key} className="text-[10px] sm:text-xs">
              {key}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(contentData.messageTemplates).map(([key, messages]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                onClick={() => copyToClipboard(msg, `${key}-${idx}`)}
                className="p-4 bg-card rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm leading-relaxed">{msg}</p>
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

      <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10">
        <h3 className="font-headline font-bold text-primary mb-2 flex items-center gap-2">
          Dica de Ouro
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Use os templates como ponto de partida. O segredo é manter a mensagem curta e não demonstrar ansiedade por uma resposta.
        </p>
      </div>
    </div>
  );
}
