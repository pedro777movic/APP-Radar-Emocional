# Prompt de Estrutura Técnica: Radar Emocional

Este documento descreve a arquitetura do aplicativo "Radar Emocional" para fins de auditoria, expansão ou refatoração em ambientes de IA (como ChatGPT).

---

## 1. Visão Geral do Produto
O **Radar Emocional** é um aplicativo mobile-first de análise estratégica de relacionamentos. Ele permite que usuárias avaliem seu estado emocional através de um quiz, gerando um score de 0 a 100% que dita um plano de ação e fornece ferramentas (templates de mensagens) para comunicação assertiva.

## 2. Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **Biblioteca UI:** React 19 + ShadCN UI
- **Estilização:** Tailwind CSS (Tema Dark #0B0F16)
- **Ícones:** Lucide-React
- **Persistência:** LocalStorage (Offline-first)
- **Animações:** Tailwind Animate + Keyframes customizados

## 3. Estrutura de Arquivos Principal
- `src/app/page.tsx`: Gerenciador de estados global (Router interno: SPLASH, AUTH, ONBOARDING, DASHBOARD, QUIZ, TOOLKIT, SETTINGS).
- `src/lib/store.ts`: Hook `useLocalData` que gerencia o estado no LocalStorage, incluindo persistência de sessões, PIN criptografado (Base64) e passos do plano de ação.
- `public/assets/content.json`: Cérebro do app. Contém todas as perguntas do quiz, mapeamento de scores, textos de resultados, planos de ação e templates de mensagens.
- `src/app/components/`:
    - `Dashboard.tsx`: Exibe o radar (gráfico SVG customizado) com o score da última sessão e link para o plano de ação.
    - `Quiz.tsx`: Lógica de avaliação com 4 questões e animação de processamento ("Analyzing").
    - `Toolkit.tsx`: Interface de abas para copiar templates de mensagens e simulação de áudios premium.
    - `Auth/PIN`: O app inicia com um PIN padrão `3344`.

## 4. Lógica de Negócio (Regras Cruciais)
- **PIN:** O login é local. O PIN padrão é `3344`. Se o usuário entrar como convidado, o app pula a tela de PIN nas próximas vezes.
- **Cálculo do Score:** O quiz soma valores das respostas (Sim=100, Às vezes=50, Não=0) e divide pelo número de questões.
- **Mapeamento de Níveis:**
    - 0-33%: Low (Equilíbrio)
    - 34-66%: Medium (Atenção/Médio)
    - 67-100%: High (Alto Risco/Alerta)
- **Persistência:** Todos os dados são salvos em um objeto JSON único no `localStorage` sob a chave `radar_emocional_data_v2`.

## 5. Identidade Visual
- **Background:** Dark Gray (#0B0F16)
- **Primary:** Blue (#1E6FFF)
- **Accent:** Soft Purple (#8A6EF0)
- **Bordas:** Arredondadas (8px/Radius lg) com efeitos de vidro (backdrop-blur) e brilho sutil (glow-primary).

## 6. Constraints para IA
- O app deve funcionar 100% offline.
- Não usar APIs externas para dados (tudo vem do `content.json`).
- Manter o foco mobile (max-width: 448px/md).
- No Next.js 15, não desestruturar `params` ou `searchParams` diretamente para evitar erros de enumeração.

---
*Fim do documento de referência.*
