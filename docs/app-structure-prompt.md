# Prompt de Estrutura Técnica: Radar Emocional (v2 - Motor Adaptativo)

Este documento descreve a arquitetura do aplicativo "Radar Emocional" para fins de auditoria, expansão ou refatoração em ambientes de IA.

---

## 1. Visão Geral do Produto
O **Radar Emocional** é um aplicativo mobile-first de análise estratégica de relacionamentos. Ele permite que usuárias avaliem a dinâmica afetiva através de um quiz dinâmico, gerando um score de 0 a 100% e um diagnóstico baseado em subcategorias psicológicas.

## 2. Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **Biblioteca UI:** React 19 + ShadCN UI
- **Estilização:** Tailwind CSS (Tema Dark #0B0F16)
- **Ícones:** Lucide-React
- **Persistência:** LocalStorage (Offline-first)
- **Segurança:** PIN de acesso local (Padrão: `3344`)

## 3. Lógica de Negócio e Motor Psicológico
- **Banco de Perguntas:** Possui um pool de 12 perguntas estruturadas.
- **Seleção Dinâmica:** A cada análise, o app sorteia aleatoriamente 4 perguntas (sem repetição).
- **Subcategorias (Dimensões):** Cada pergunta pertence a uma categoria:
    - *Investimento:* Energia e projeção futura.
    - *Consistência:* Estabilidade comportamental.
    - *Prioridade:* Espaço na agenda e mente.
    - *Reciprocidade:* Equilíbrio de esforço.
- **Cálculo de Score Ponderado:** Cada pergunta tem um peso (2 ou 3). O score final é normalizado de 0 a 100%.
- **Diagnóstico Adaptativo:** Além do nível geral (Low/Medium/High), o app identifica a "Categoria Crítica" (menor subscore) para exibir insights específicos.

## 4. Estrutura de Arquivos Principal
- `src/app/page.tsx`: Gerenciador de estados global (Router interno: SPLASH, AUTH, ONBOARDING, DASHBOARD, QUIZ, TOOLKIT, SETTINGS).
- `src/lib/store.ts`: Hook `useLocalData` que gerencia a persistência no LocalStorage (chave: `radar_emocional_data_v2`).
- `public/assets/content.json`: Cérebro do app. Contém o pool de perguntas, pesos, categorias, textos de resultados e templates de mensagens.
- `src/app/components/`:
    - `Quiz.tsx`: Implementa o motor de shuffle, cálculo ponderado e identificação de fraqueza categorial.
    - `Dashboard.tsx`: Exibe o radar visual (SVG), o score e o ponto mais crítico da relação.
    - `Toolkit.tsx`: Templates de mensagens (5 por categoria: Curiosidade, Distância, Limite, Reengajamento).

## 5. Constraints Críticas
- **Offline Total:** Nenhuma dependência de APIs externas ou nuvem.
- **Next.js 15 Compliance:** Não enumerar `params` ou `searchParams` síncronos (as funções de página e layout devem ser limpas ou usar `use()`).
- **Navegação Segura:** O fluxo de autenticação é protegido contra loops de reidratação de estado.
- **Design:** Foco estrito em Mobile (max-width: 448px).

---
*Fim do documento de referência técnica.*
