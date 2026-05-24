# Arquitetura do Sistema

Este documento descreve a arquitetura geral da Plataforma Gamificada de Ensino de Programação, visando orientar futuros desenvolvimentos.

## 1. Visão Geral
O sistema é composto por duas aplicações principais que se comunicam via API RESTful:
- **Frontend**: Aplicação Web interativa voltada para a experiência do usuário, construída com Next.js.
- **Backend**: API central que gerencia regras de negócio, persistência de dados e integrações (incluindo o motor de correção automática de código).
- **Banco de Dados**: PostgreSQL, utilizado de forma relacional para armazenar Usuários, Exercícios, Submissões e progresso.

## 2. Tecnologias Principais
- **Frontend:**
  - **Framework:** Next.js (App Router, Server-Side Rendering e Static Site Generation)
  - **Linguagem:** TypeScript
  - **Estilização:** Tailwind CSS
  - **Gerenciamento de Estado:** React Context API ou Zustand (a definir conforme complexidade)

- **Backend:**
  - **Framework:** Node.js com Express
  - **Linguagem:** TypeScript
  - **ORM/Query Builder:** Prisma ou TypeORM (a ser implementado)
  - **Autenticação:** JWT (JSON Web Tokens)
  - **Segurança:** CORS, Helmet, Bcrypt (para senhas)

- **Infraestrutura e Dados:**
  - **Banco de Dados:** PostgreSQL 15+
  - **Containers:** Docker e Docker Compose (para ambiente de desenvolvimento local e motor de execução)
  - **Deploy:** Discloud (Frontend, Backend e Banco de Dados)

## 3. Fluxo de Dados Básico
1. O usuário acessa a aplicação (Frontend) e realiza login. O Frontend requisita um token JWT para o Backend.
2. Com o token, o Frontend consome rotas protegidas (ex: listar exercícios).
3. Ao resolver um exercício, o Frontend envia o código-fonte (em JSON) via `POST /api/submissions`.
4. O Backend recebe, valida e envia o código para o Motor de Execução Seguro (Sandbox) e/ou IA.
5. O resultado (sucesso, erro de compilação, feedback) retorna para o Backend, que atualiza a pontuação (XP) do aluno no PostgreSQL e responde ao Frontend.

## 4. Estrutura de Diretórios do Monorepo
- `/frontend/`: Código do Next.js
- `/backend/`: Código da API em Express
- `/docs/`: Documentações de produto e técnicas
- `docker-compose.yml`: Orquestração local do banco de dados (e futuramente do motor de execução de código)
