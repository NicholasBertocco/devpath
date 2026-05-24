# Plano de Desenvolvimento: Plataforma Gamificada de Ensino de Programação

Este documento detalha as etapas de desenvolvimento baseadas no PRD (`prd.md`), estruturando o projeto em fases acionáveis.

## Fase 0: Configuração Inicial e Arquitetura
- **Passo 0.1:** Inicializar o repositório (monorepo ou pastas separadas para `frontend` e `backend`).
- **Passo 0.2:** Configurar o banco de dados PostgreSQL (via Docker Compose para ambiente local).
- **Passo 0.3:** Inicializar o backend em Node.js com Express e TypeScript.
- **Passo 0.4:** Inicializar o frontend em Next.js (SSR + SPA) com TailwindCSS ou outra biblioteca de UI.

## Fase 1: MVP - Autenticação e Usuários
- **Passo 1.1:** Modelagem do banco de dados para Usuários e Perfis (Aluno, Instrutor, Admin).
- **Passo 1.2:** Implementar API de Autenticação (Cadastro, Login, JWT) no backend.
- **Passo 1.3:** Implementar páginas de Login e Cadastro no frontend.
- **Passo 1.4:** Configurar proteção de rotas (CORS, Middlewares de autenticação no backend, rotas privadas no frontend).

## Fase 2: Sistema de Exercícios (CRUD)
- **Passo 2.1:** Modelagem de dados para Exercícios e Casos de Teste.
- **Passo 2.2:** Desenvolver APIs para listagem, criação, edição e exclusão de exercícios (Acesso restrito para Instrutores/Admin).
- **Passo 2.3:** Criar interface de listagem de exercícios para alunos.
- **Passo 2.4:** Criar interface de gerenciamento de exercícios para instrutores.
- **Passo 2.5:** Criar o ambiente de resolução do exercício (Editor de código no frontend).

## Fase 3: Motor de Execução e Correção Automática
- **Passo 3.1:** Modelagem de dados para Submissões de Código.
- **Passo 3.2:** Desenvolver o serviço de execução segura de código (Sandbox/Docker).
- **Passo 3.3:** Integrar agente de IA para análise de código e geração de feedback.
- **Passo 3.4:** Implementar API de submissão que orquestra a execução, correção via IA e salva o resultado.
- **Passo 3.5:** Atualizar o frontend para exibir feedback em tempo real após a submissão.

## Fase 4: Gamificação
- **Passo 4.1:** Modelagem de dados para Pontuação (XP), Níveis e Conquistas (Badges).
- **Passo 4.2:** Desenvolver lógica de atribuição de pontos e cálculo de níveis ao concluir exercícios com sucesso.
- **Passo 4.3:** Criar sistema de distribuição de Badges.
- **Passo 4.4:** Criar o Dashboard do Aluno no frontend (Exibição de progresso, XP, Nível e Badges).

## Fase 5: Refinamentos, Segurança e Deploy
- **Passo 5.1:** Revisão de segurança (Sanitização de dados, rate limiting, isolamento rígido de containers).
- **Passo 5.2:** Criação de testes unitários e de integração para os fluxos principais.
- **Passo 5.3:** Preparar arquivos de configuração para deploy (Dockerfiles, CI/CD).
- **Passo 5.4:** Deploy na infraestrutura escolhida (Discloud para Frontend, Backend e DB).

---

## Próximos Passos
Aguardando aprovação do plano para iniciar a **Fase 0** e a configuração do ambiente.