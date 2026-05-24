# Plano de Desenvolvimento: Módulo de Aulas (Lessons)

## Visão Geral
Adicionar um módulo de Aulas Escritas Interativas focadas em Lógica de Programação (Python e JS). As aulas servirão como base teórica antes dos exercícios práticos. A leitura e conclusão de aulas também recompensará os alunos com XP e Conquistas, mantendo o engajamento gamificado.

## Fase 5: Sistema de Aulas Interativas

### 5.1 Modelagem de Dados (Prisma)
- Criar a entidade `Lesson`:
  - `id`, `title`, `content` (Markdown ou Rich Text).
  - `language` (javascript, python, logic).
  - `xpReward` (quantidade de XP ganha ao concluir a aula).
  - `authorId` (relacionamento com User - Instrutor).
- Criar a entidade `UserLessonProgress`:
  - `userId`, `lessonId`, `completedAt` (Para registrar que o aluno leu/completou a aula e evitar que ganhe XP infinitamente lendo a mesma aula).

### 5.2 Backend (API de Aulas)
- **Rotas Públicas (Alunos):**
  - `GET /api/lessons`: Listar todas as aulas disponíveis.
  - `GET /api/lessons/:id`: Ler o conteúdo de uma aula específica.
  - `POST /api/lessons/:id/complete`: Endpoint que o aluno chama ao clicar no botão "Concluir Aula". Este endpoint irá:
    - Verificar se ele já não completou antes.
    - Adicionar XP ao perfil do aluno.
    - Verificar e atribuir Badges (ex: "Leitor Assíduo" ou "Iniciante em Lógica").
- **Rotas Restritas (Instrutor/Admin):**
  - `POST /api/lessons`: Criar nova aula escrita.
  - `PUT /api/lessons/:id`: Editar aula existente.
  - `DELETE /api/lessons/:id`: Excluir aula.

### 5.3 Frontend (Interfaces de Aulas)
- **Painel do Aluno:**
  - Página `/lessons`: Uma trilha de aprendizado visualmente atraente mostrando os "Módulos" de aulas (ex: Variáveis, Condicionais, Laços de Repetição).
  - Página `/lessons/[id]`: A tela de leitura da aula. 
    - Layout agradável e espaçado (estilo Notion/Medium) para não cansar a leitura.
    - Um grande botão no final da página: "Li e Entendi (Ganhar XP!)".
- **Painel do Instrutor:**
  - Página `/lessons/create`: Editor simples (Markdown) para o professor escrever o conteúdo da aula, definir o título, linguagem e recompensa de XP.

### 5.4 Gamificação e Conquistas (Badges)
- Adicionar no backend a criação automática de novas Badges ligadas às aulas:
  - **"Primeira Leitura"**: Ao completar 1 aula.
  - **"Estudioso"**: Ao completar 5 aulas.
  - **"Lógica Dominada"**: Ao completar todas as aulas da trilha de lógica.

---
**Status do Plano:** Aguardando aprovação para iniciar a modelagem no banco de dados.