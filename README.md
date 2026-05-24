# DevPath — Plataforma Gamificada de Ensino de Programação

> Trabalho de Conclusão de Curso (TCC) — Plataforma web para o aprendizado de programação através de gamificação, exercícios práticos e correção automática de código.

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Modelo de Dados](#modelo-de-dados)
- [Rotas da API](#rotas-da-api)

---

## Sobre o Projeto

O **DevPath** é uma plataforma de ensino de programação que combina conteúdo teórico e exercícios práticos com elementos de gamificação — XP, níveis, badges e ranking — para aumentar o engajamento e a retenção de conhecimento dos alunos.

O sistema permite que alunos aprendam no próprio ritmo, submetam código para correção automática e acompanhem sua evolução em um dashboard personalizado. Instrutores podem criar aulas e exercícios, enquanto administradores gerenciam a plataforma.

---

## Funcionalidades

| Módulo           | Descrição                                              |
| ---------------- | ------------------------------------------------------ |
| **Autenticação** | Cadastro, login e autorização por papéis (JWT)         |
| **Aulas**        | Criação e leitura de aulas em Markdown por linguagem   |
| **Exercícios**   | Criação de exercícios com casos de teste e dificuldade |
| **Submissões**   | Envio de código com correção automática via sandbox    |
| **Gamificação**  | Sistema de XP, níveis e badges/conquistas              |
| **Ranking**      | Leaderboard com os alunos mais pontuados               |
| **Dashboard**    | Progresso e estatísticas individuais do aluno          |

---

## Tecnologias

### Frontend

- **Next.js 16** (App Router, SSR/SSG)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Monaco Editor** (editor de código in-browser)
- **React Markdown** (renderização de aulas)

### Backend

- **Node.js** + **Express 5** + **TypeScript**
- **Prisma ORM** + **PostgreSQL 15**
- **JWT** (autenticação)
- **Bcrypt** (hash de senhas)
- **Helmet** + **CORS** + **express-rate-limit** (segurança)
- **Zod** (validação de entrada)
- **Jest** + **Supertest** (testes)

### Infraestrutura

- **Docker** + **Docker Compose** (banco de dados local)
- **Discloud** (deploy de produção)

---

## Arquitetura

```
Browser (Next.js)
      │  HTTP/REST
      ▼
API Express (Node.js)
      │
      ├── PostgreSQL (Prisma ORM)
      └── Code Sandbox (execução segura de código)
```

O frontend consome a API REST do backend. Ao submeter um exercício, o backend encaminha o código para um motor de execução seguro (sandbox), avalia os casos de teste, atualiza o XP do aluno e retorna o feedback.

---

## Estrutura de Diretórios

```
devpath/
├── docker-compose.yml        # PostgreSQL local
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     # Modelos do banco de dados
│   └── src/
│       ├── controllers/      # Lógica de cada recurso
│       ├── routes/           # Definição das rotas HTTP
│       ├── middlewares/      # Auth, roles
│       ├── services/         # Serviços externos (sandbox)
│       ├── utils/            # Helpers (JWT, etc.)
│       └── lib/              # Cliente Prisma
├── frontend/
│   └── src/
│       └── app/
│           ├── dashboard/
│           ├── exercises/
│           ├── lessons/
│           ├── leaderboard/
│           ├── login/
│           └── register/
└── docs/                     # Documentação do produto
```

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd devpath
```

### 2. Suba o banco de dados

```bash
docker-compose up -d
```

Isso inicializa o PostgreSQL na porta `5432`.

### 3. Configure e inicie o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente)) e execute:

```bash
npx prisma migrate dev
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

### 4. Configure e inicie o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
PORT=3333
DATABASE_URL="postgresql://admin:admin123@localhost:5432/gamificacao_db?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
```

> **Atenção:** Nunca commite o arquivo `.env` no repositório. Adicione-o ao `.gitignore`.

---

## Scripts Disponíveis

### Backend (`/backend`)

| Comando         | Descrição                                     |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Inicia em modo desenvolvimento com hot-reload |
| `npm run build` | Compila o TypeScript para `dist/`             |
| `npm start`     | Inicia o build de produção                    |
| `npm test`      | Executa os testes com Jest                    |

### Frontend (`/frontend`)

| Comando         | Descrição                             |
| --------------- | ------------------------------------- |
| `npm run dev`   | Inicia em modo desenvolvimento        |
| `npm run build` | Gera o build de produção              |
| `npm start`     | Inicia o servidor Next.js em produção |
| `npm run lint`  | Verifica o código com ESLint          |

---

## Modelo de Dados

```
User ──< Submission >── Exercise ──< TestCase
 │
 ├──< UserBadge >── Badge
 ├──< UserLessonProgress >── Lesson
 └── (XP, Level, Role)
```

| Modelo       | Descrição                                                             |
| ------------ | --------------------------------------------------------------------- |
| `User`       | Aluno, Instrutor ou Admin com XP e nível                              |
| `Exercise`   | Desafio de código com dificuldade e pontos                            |
| `TestCase`   | Casos de entrada/saída para validar a submissão                       |
| `Submission` | Tentativa do aluno com código e status (PENDING/SUCCESS/FAILED/ERROR) |
| `Lesson`     | Aula teórica em Markdown com recompensa de XP                         |
| `Badge`      | Conquista desbloqueável pelo aluno                                    |

---

## Rotas da API

Base URL: `http://localhost:3333`

| Método | Rota             | Descrição                   | Auth       |
| ------ | ---------------- | --------------------------- | ---------- |
| `POST` | `/auth/register` | Cadastro de novo usuário    | Não        |
| `POST` | `/auth/login`    | Login e geração de JWT      | Não        |
| `GET`  | `/lessons`       | Lista todas as aulas        | Sim        |
| `POST` | `/lessons`       | Cria uma aula               | Instrutor+ |
| `GET`  | `/exercises`     | Lista todos os exercícios   | Sim        |
| `POST` | `/exercises`     | Cria um exercício           | Instrutor+ |
| `POST` | `/submissions`   | Envia código para correção  | Sim        |
| `GET`  | `/ranking`       | Retorna o leaderboard       | Sim        |
| `GET`  | `/badges`        | Lista as badges disponíveis | Sim        |

---

## Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC). Todos os direitos reservados ao autor.
