# Plano de Direcionamento Pós Login/Sign-up

## Premissas

1. **Fonte única de papéis**: todo direcionamento pós autenticação usará exclusivamente o campo `roles` da tabela `public.profiles` no Supabase. Esse campo é um array de strings (ex.: `['coordenador_regional', 'colaborador']`) e define quais interfaces o usuário pode acessar.
2. **Uso simplificado (MVP)**: apesar de `roles` ser uma lista, trataremos cada perfil com **apenas um valor ativo** neste primeiro momento. Ou seja, se o registro estiver marcado como `colaborador`, direciona para `/dashboard`; `coordenador` → `/mobile/coordenador`; `lideranca` → `/mobile/lideranca`.

## Plano de implementação (ordem sugerida)

1. **Mapeamento e prioridade de roles**
   - Levantar todos os valores possíveis em `profiles.roles`.
   - Definir prioridade (ex.: `coordenador > lideranca > colaborador`), já que o redirecionamento usará o papel “mais forte”. Enquanto estivermos na estratégia simplificada (apenas um role por perfil), basta garantir que o valor armazenado esteja correto.
   - Revisar o schema Supabase (tabelas, views, policies) e entender profundamente como o projeto consome o `supabase-js` (clients, providers, server actions), para não quebrar fluxos existentes.

2. **Definição de rotas alvo**
   - `/` deve redirecionar:
     - Usuário **não autenticado** → `/login`.
     - Usuário autenticado com `roles` contendo `coordenador` → `/mobile/coordenador`.
     - Usuário autenticado com `roles` contendo `lideranca` → `/mobile/lideranca`.
     - Usuário autenticado com `roles` contendo `colaborador` → `/dashboard`.
     - Usuário autenticado sem role válida → `/sem-acesso` (página orientando a solicitar acesso).

3. **Estruturação das páginas mobile por role**
   - Criar `src/app/mobile/coordenador/page.tsx` com subpastas `components/` e `hooks/`.
   - Criar `src/app/mobile/lideranca/page.tsx` com subpastas `components/` e `hooks/`.
   - Migrar o código atual dos componentes unificados para essas novas rotas.
   - Garantir que `/mobile/layout.tsx` continue fornecendo metadados/viewport e que os novos diretórios sigam o padrão de outras páginas do projeto (components, hooks, utils).
   - Páginas/rotas que precisam ser criadas/atualizadas:
     - `src/app/mobile/coordenador/page.tsx` (+ `components/`, `hooks/`).
     - `src/app/mobile/lideranca/page.tsx` (+ `components/`, `hooks/`).
     - `src/app/sem-acesso/page.tsx` (nova).
     - `src/middleware.ts` (ou equivalente) para centralizar as regras.
     - Fluxos de `/login`, `/signup` e qualquer server action que trate autenticação precisam ser ajustados para aproveitar a estrutura Supabase já existente (clients/config em `@/lib/supabase`), evitando duplicação.

4. **Busca e cache das roles logo após autenticação**
   - Ajustar o fluxo de login/sign-up para ler `profiles.roles` imediatamente (server action ou endpoint dedicado).
   - Reutilizar essa leitura tanto no middleware quanto nas páginas que precisarem da role.

5. **Middleware/guard de redirecionamento**
   - Implementar middleware (ou server component dedicado) que:
     - Em qualquer rota privada, verifica sessão Supabase. Caso o usuário esteja deslogado, redireciona imediatamente para `/login`, independentemente da URL acessada.
     - Chama helper `getPrimaryRole` e, se a role atual não tiver permissão para a rota requisitada, redireciona automaticamente para a rota correspondente definida no passo 2 (`/dashboard`, `/mobile/coordenador`, `/mobile/lideranca`).
     - Redireciona para `/sem-acesso` quando `roles` vier vazio/desconhecido.

6. **Fallbacks e UX**
   - Construir a página `/sem-acesso` com instruções para solicitar liberação.
   - Ajustar a página de login para, após autenticar com sucesso, encaminhar o usuário para a rota permitida conforme sua role.
   - Após um cadastro bem-sucedido (sign-up), direcionar o usuário para **`/sem-acesso`**, exibindo mensagem clara para contatar a coordenação e solicitar a atribuição de uma role; somente depois da designação ele conseguirá acessar o sistema.
   - Registrar logs/telemetria básicos para detectar perfis sem role.
