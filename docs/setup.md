# Setup Local do Projeto

Este guia detalha como configurar e rodar a plataforma localmente para desenvolvimento.

## Pré-requisitos
- Node.js (v18 ou superior)
- NPM (v9 ou superior)
- Docker e Docker Compose instalados

## 1. Configurando o Banco de Dados (PostgreSQL)
Na raiz do projeto (`devpath`), execute o Docker Compose para subir a instância do banco:

```bash
docker-compose up -d
```

Isso inicializará o PostgreSQL na porta `5432` com os dados persistidos na pasta `./docker-data/pgdata` e as variáveis de ambiente definidas no arquivo `docker-compose.yml`.

## 2. Configurando o Backend
O backend utiliza Node.js, Express e TypeScript.

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na pasta `backend` com base no `.env.example` (se disponível) ou com as seguintes variáveis:
   ```env
   PORT=3333
   DATABASE_URL="postgresql://admin:admin123@localhost:5432/gamificacao_db?schema=public"
   JWT_SECRET="sua_chave_secreta_local"
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
O servidor estará rodando em `http://localhost:3333`.

## 3. Configurando o Frontend
O frontend utiliza Next.js e Tailwind CSS.

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
O frontend estará rodando em `http://localhost:3000`.

---

## Estrutura Atual
- Certifique-se de que o backend esteja rodando antes de realizar chamadas de API através do frontend.
- O Docker é imprescindível para emular o banco de dados e, no futuro, o isolamento (sandbox) de compilação de código dos alunos.
