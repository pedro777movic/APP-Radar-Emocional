# Prompt de Estrutura Técnica: Radar Emocional (v3 - The Reaction Update)

Este documento descreve a arquitetura e funcionalidades do "Radar Emocional v3" para referência em auditorias ou expansões via IA.

---

## 1. Visão Geral do Produto
O **Radar Emocional** é um sistema mobile-first de intervenção estratégica. Ele não apenas diagnostica a saúde de uma relação, mas fornece um protocolo tático (scripts e ações) para reverter padrões de desvalorização e frieza.

## 2. Funcionalidades Principais
- **Acesso Seguro:** PIN de 4 dígitos (3344) com armazenamento local criptografado.
- **Motor de Diagnóstico:** Banco de 12 perguntas com sorteio aleatório de 4 por sessão, avaliando Investimento, Consistência, Prioridade e Reciprocidade.
- **Cálculo de Score Ponderado:** Resultados de 0 a 100% com identificação automática da categoria mais fraca (Ponto Crítico).
- **Protocolo de Reação (V3):** 
    - Timer de 24h para gerar urgência.
    - Ações de choque imediatas.
    - Biblioteca de scripts "Copy-Paste" para emergências (Vácuo, Frieza).
    - Plano de Resgate de 3 dias (Timeline estratégica).

## 3. Stack Tecnológica
- **Framework:** Next.js 15 (App Router).
- **UI:** React 19, Tailwind CSS, ShadCN UI.
- **Estilo:** Tema Dark (#0B0F16) com sotaques em Azul Radar (#1E6FFF).
- **Persistência:** LocalStorage (Offline-first total).

## 4. Estrutura de Arquivos
- `src/lib/store.ts`: Gerencia o estado global, PIN, sessões e cronômetro de 24h.
- `public/assets/content.json`: O "cérebro" contendo perguntas, scripts táticos e o plano de 3 dias.
- `src/app/page.tsx`: Orquestrador de rotas internas (Splash, Auth, Dashboard, Quiz, Protocolo).
- `src/app/components/ProtocoloReacao.tsx`: Componente central da V3 que entrega o conteúdo de intervenção.

## 5. Lógica de Intervenção
O diagnóstico é adaptativo: se o app detecta falha em "Investimento", ele prioriza scripts de "Escassez". Se a falha é em "Reciprocidade", prioriza "Espelhamento".

---
*Fim do documento.*