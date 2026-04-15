# Prompt de Estrutura Técnica: Radar Emocional v3 (The Reaction Update)

Este documento descreve a arquitetura final e o motor de inteligência do **Radar Emocional**, um sistema mobile-first de intervenção estratégica em relacionamentos.

---

## 1. Visão Geral do Produto
O app é um software de **análise comportamental e protocolo tático**. Ele diagnostica o nível de "esfriamento" de uma relação e fornece um plano de ação (scripts e cronogramas) para reverter desvalorização emocional.

## 2. Stack Tecnológica
- **Framework:** Next.js 15 (App Router) + React 19.
- **UI:** Tailwind CSS + ShadCN UI + Lucide Icons.
- **Design System (Identity CBA):**
    - **Cores:** Fundo `#030005`, Roxo `#9d00ff`, Verde Neon `#00ff8f` (CTA), Azul Elétrico `#00f0ff`.
    - **Efeitos:** Glassmorphism (blur 12px), Grid Dark (40px), Pulse Glow nos botões.
    - **Fontes:** `Outfit` (Títulos) e `Inter` (Corpo).
- **Persistência:** LocalStorage (Offline-first total).
- **Segurança:** PIN de acesso local (`3344`) com validação estrita.

## 3. Motor de Inteligência (Algoritmo do Quiz)
- **Banco de Dados:** Pool de 25 perguntas categorizadas.
- **Sorteio Dinâmico:** Seleciona 10 perguntas por sessão (Garante 1 de cada categoria CORE: Investimento, Consistência, Prioridade e Reciprocidade).
- **Categorias (10 Dimensões):** Investimento, Consistência, Prioridade, Reciprocidade, Profundidade, Comunicação, Interesse, Dinâmica, Percepção e Alertas.
- **Score Ponderado:** Cada pergunta possui peso (2 ou 3) e lógica reversa opcional. O score final é normalizado de 0 a 100%.
- **Diagnóstico Adaptativo:** Identifica a "Categoria Crítica" (menor subscore proporcional) para personalizar o protocolo de reação.

## 4. Funcionalidades de Intervenção (V3)
- **Dashboard Pós-Análise:** Exibe score %, Ponto Crítico e o card de "Protocolo Ativado".
- **Timer de Urgência:** Cronômetro regressivo de 24h que inicia após o término do quiz.
- **Protocolo de Reação (3 Abas):**
    1. **Ações 24h:** Checklist de choque imediato.
    2. **Scripts (Copy-Paste):** Biblioteca de mensagens para Vácuo, Frieza, etc.
    3. **Plano de 3 Dias:** Linha do tempo vertical (Afastamento -> Curiosidade -> Xeque-Mate).
- **Toolkit:** Central de mensagens secundárias e áudios estratégicos (Premium).

## 5. Estrutura de Arquivos Crítica
- `src/lib/store.ts`: Hook `useLocalData` que gerencia o estado global, persistência e autenticação.
- `public/assets/content.json`: O "Cérebro" contendo as 25 perguntas, pesos, scripts e textos adaptativos.
- `src/app/page.tsx`: Orquestrador de rotas internas (Splash -> Auth -> Onboarding -> Dashboard).
- `src/app/components/Quiz.tsx`: Implementa a lógica de shuffle, pesos e identificação de fraqueza.
- `src/app/components/ProtocoloReacao.tsx`: Componente tático de entrega de conteúdo.

## 6. Lógica de Segurança
- Acesso bloqueado por PIN obrigatório (3344).
- Loop de autenticação protegido por travas de estado na Splash.
- Reset de dados limpa LocalStorage e redireciona para Auth limpa.

---
*Fim do documento.*