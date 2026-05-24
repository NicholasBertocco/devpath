# Registro de Alterações (Changelog)

Este documento centraliza o progresso do desenvolvimento, correções de bugs (hotfixes) e decisões arquiteturais tomadas durante a evolução da Plataforma Gamificada de Ensino de Programação.

---

## [Fase 1] MVP - Autenticação e Usuários (Concluído)
**Objetivo:** Permitir que usuários criem contas, façam login e visualizem o Dashboard.

### Implementações:
- **Banco de Dados (Prisma):** Criada a modelagem inicial `User` contendo `id`, `name`, `email`, `password`, `role` (STUDENT, INSTRUCTOR, ADMIN), `xp`, e `level`.
- **Backend (Node.js/Express):** 
  - Implementada rota `/api/auth/register` (Cadastro) com validação de dados usando `Zod` e hash de senhas com `bcryptjs`.
  - Implementada rota `/api/auth/login` retornando token JWT e dados básicos do usuário.
  - Middleware de autenticação (`authenticate`) criado para proteger futuras rotas.
- **Frontend (Next.js/Tailwind):**
  - Criadas as páginas públicas `/login` e `/register`.
  - Criada a página protegida `/dashboard` exibindo os dados da conta (XP, Nível, Perfil).

### Correções e Hotfixes:
- **[Fix] Conflito do Prisma v7 com CommonJS (tsx watch):**
  - **Problema:** A versão 7 do `@prisma/client` introduziu um `PrismaClientConstructorValidationError` ao tentar ler a `datasourceUrl` ou `datasources` pelo construtor no formato CJS/Node.
  - **Solução:** Feito o *downgrade* do Prisma para a versão 5 (`npm install prisma@5 @prisma/client@5`). O schema foi atualizado para carregar a `env("DATABASE_URL")` nativamente, contornando o erro de inicialização.
- **[Fix] TypeError (Cannot read properties of undefined reading '0'):**
  - **Problema:** O pacote `Zod` ao interceptar falhas na validação (como senha < 6 caracteres), não garantia que o array `errors` viria sempre preenchido no bloco `catch`, resultando num crash na API (`error.errors[0]`).
  - **Solução:** Substituído o catch genérico por `if (error instanceof z.ZodError)`. Adicionado o mapeamento seguro dos erros (`error.errors.map(err => err.message).join(", ")`), permitindo que a API sempre responda com `Status 400` amigável sem derrubar o servidor.

---

## [Fase 2] Sistema de Exercícios (Concluído)
**Objetivo:** Criar CRUD completo para os desafios de programação e interface de resolução.

### Implementações:
- **Backend (Node.js/Prisma):** 
  - Adicionados modelos `Exercise` e `TestCase`.
  - Criado o `ExerciseController` com métodos `createExercise`, `getExercises` e `getExerciseById`.
  - Criado o middleware de proteção `authorizeRole` (para garantir que só INSTRUCTOR ou ADMIN criem exercícios).
- **Frontend (Next.js):**
  - Criada a página de listagem de exercícios em `/exercises`.
  - Inserido botão dinâmico que exibe "+ Novo Exercício" se o usuário for Instrutor/Admin.
  - Atualizado o Dashboard com o botão "Ver Exercícios".
  - Criada a página restrita `/exercises/create` para inserção de desafios, contendo suporte a múltiplos casos de teste dinâmicos (Input, Expected Output, isHidden).
  - Integrado o **Monaco Editor** (o mesmo motor do VS Code) para a página `/exercises/[id]`. A interface foi desenhada no estilo "Dark Mode" de IDEs reais, dividindo o Enunciado/Casos de Teste (esquerda) e o Editor de Código (direita).

---

## [Fase 3] Motor de Execução e Correção Automática (Concluído)
**Objetivo:** Receber o código do aluno e testá-lo de forma isolada contra os casos de teste do banco de dados, retornando sucesso/erro e feedback.

### Implementações:
- **Backend:**
  - Modelagem da tabela `Submission` no Prisma para histórico.
  - Criado o serviço `CodeSandboxService` usando o módulo nativo `vm` do Node.js, executando código javascript de forma isolada, com bloqueio de logs e timeout de 2 segundos para prevenir *loops infinitos*.
  - Rota `POST /api/submissions` criada para submissão de código.
  - Implementada a mecânica de Gamificação: Se todos os testes passarem (e for a primeira vez do aluno resolvendo), ele ganha XP e pode subir de nível (1 Nível a cada 100 XP).
  - Segurança dos testes ocultos garantida (`isHidden`), evitando que alunos usem "print" para ver as respostas esperadas dos professores.
- **Frontend:**
  - O botão "Executar Código" agora envia a requisição para a API de Submissão e renderiza os feedbacks.
  - Desenvolvido o Painel Dinâmico de Feedback no rodapé do editor (Monaco), mostrando quais testes falharam, onde foi o erro de sintaxe, ou celebrando os XP ganhos.
  - Atualização do *localStorage* em tempo real para sincronizar o level/xp do usuário no Header e Dashboard sem precisar relogar.

---

## [Fase 4] Expansão e Gamificação (Concluído)
**Objetivo:** Refinar as mecânicas de jogo e adicionar rankings.

### Implementações:
- **Backend:**
  - Criada rota `/api/ranking` (GET) para retornar o *Top 50* dos alunos ordenados pelo XP (`RankingController`). Apenas perfis `STUDENT` são computados.
  - Atualizado o Schema do Prisma incluindo as tabelas de suporte para futuras implementações visuais: `Badge` (Conquista) e `UserBadge` (Relação de N:N do usuário ganhando a conquista).
- **Frontend:**
  - Criada a página de Ranking Global em `/leaderboard`.
  - Interface desenvolvida com *Tailwind CSS*, com destaque especial (medalhas e cores) para os alunos do Top 3 (1º, 2º e 3º lugar).
  - Adicionado botão amigável de atalho no Dashboard ("Ranking 🏆").

---

## [Fase 6] Refinamentos, Segurança e Deploy (Concluído)
**Objetivo:** Preparar a aplicação para o ambiente de produção.

### Implementações:
- **Segurança Backend:** 
  - Adicionado `helmet` para proteger headers HTTP.
  - Implementado `express-rate-limit` para barrar ataques de força bruta, limitando a 100 requisições por IP a cada 15 minutos na API.
- **Qualidade de Código e Testes:**
  - Configurado o framework de testes `Jest` juntamente com `Supertest` para chamadas de API.
  - Escrito teste inicial de *health check* (`/health`).
- **Arquivos de Deploy:**
  - Criados os arquivos `discloud.config` nas pastas `frontend` e `backend` parametrizados para 512MB RAM, focando no deploy fácil via Discloud CLI ou Upload ZIP.
  - Criados `Dockerfile` padrão no Frontend e Backend como alternativa caso a infraestrutura de hospedagem mude (ex: Render, Railway, AWS).
  - Adicionado script `start.sh` para compatibilidade com inicialização do Next.js na Discloud.

---

## Finalização do MVP 🚀
O fluxo completo do produto descrito no PRD foi finalizado. O usuário pode se cadastrar, listar os desafios, escrever código no editor estilo VS Code embutido, enviar sua solução para execução segura num sandbox (VM Node.js), receber feedbacks imediatos de testes ocultos, acumular XP, subir de nível, ler Aulas interativas e competir no Ranking Global. A aplicação encontra-se empacotada e segura para deploy.

---

## [Fase 5] Sistema de Aulas Interativas (Concluído)
**Objetivo:** Adicionar base teórica para os alunos lerem antes dos exercícios, com recompensa em XP.

### Implementações:
- **Backend:**
  - Modelagem das tabelas `Lesson` e `UserLessonProgress` no Prisma.
  - Criação de Rotas `/api/lessons` para criação (restrita a instrutores), listagem, e consumo (`/complete`).
  - Lógica de progresso único: O aluno só ganha XP a primeira vez que finaliza uma aula.
  - Integrado com o sistema de Badges: novas conquistas "Primeira Leitura" e "Estudioso" distribuídas automaticamente.
- **Frontend:**
  - Adicionado suporte a formatação de texto com Markdown (`react-markdown` e `@tailwindcss/typography`).
  - Painel `/lessons/create`: Interface de criação de aula em formato texto (Markdown) para os professores.
  - Trilha de Aulas `/lessons`: Cards listando os conteúdos disponíveis e mostrando um check verde caso o aluno já tenha completado.
  - Tela de Leitura `/lessons/[id]`: Layout de leitura agradável, limpo e imersivo, finalizado com um grande Call-To-Action **"Li e Entendi (+XP)"**.
  - Dashboard atualizado com atalho "Aulas 📚".