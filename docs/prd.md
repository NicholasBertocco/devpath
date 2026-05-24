# PRD — Plataforma Gamificada de Ensino de Programação

## 1. Visão Geral

A Plataforma Gamificada de Ensino de Programação tem como objetivo ensinar programação de forma interativa, prática e motivadora, utilizando conceitos de gamificação como pontos, níveis, desafios e recompensas.

O sistema permitirá que usuários aprendam programação resolvendo exercícios práticos com correção automática, acompanhando seu progresso em dashboards personalizados.

---

## 2. Objetivos do Produto

### Objetivo Principal
Facilitar o aprendizado de programação para iniciantes através de uma experiência gamificada.

### Objetivos Secundários
- Aumentar engajamento e retenção de usuários
- Automatizar correção de exercícios
- Oferecer feedback em tempo real
- Permitir escalabilidade da plataforma

---

## 3. Público-Alvo

- Estudantes iniciantes em programação
- Desenvolvedores iniciantes/intermediários
- Instituições de ensino
- Instrutores de tecnologia

---

## 4. Problemas a Resolver

- Dificuldade de aprendizado prático
- Falta de feedback imediato
- Baixo engajamento em cursos tradicionais
- Complexidade para corrigir exercícios manualmente

---

## 5. Solução Proposta

Uma plataforma web que:
- Oferece exercícios interativos
- Corrige automaticamente o código
- Aplica gamificação para engajamento
- Exibe progresso e desempenho

---

## 6. Funcionalidades Principais

### 6.1 Autenticação e Usuários
- Cadastro e login (JWT / OAuth)
- Perfis:
  - Aluno
  - Instrutor
  - Administrador

### 6.2 Sistema de Exercícios
- Criação e listagem de exercícios
- Suporte a múltiplas linguagens
- Submissão de código

### 6.3 Correção Automática
- Agente de IA para correção de código
- Execução segura (sandbox/container)
- Feedback detalhado

### 6.4 Gamificação
- Sistema de pontos (XP)
- Níveis de progressão
- Badges/conquistas
- Desafios diários

### 6.5 Dashboard
- Progresso do usuário
- Estatísticas de desempenho
- Ranking (opcional)

### 6.6 Administração
- Gerenciamento de usuários
- Criação de conteúdos
- Monitoramento da plataforma

---

## 7. Requisitos Funcionais

- RF01: Usuário deve conseguir se cadastrar e logar
- RF02: Usuário deve acessar exercícios
- RF03: Usuário deve enviar código para avaliação
- RF04: Sistema deve corrigir automaticamente
- RF05: Sistema deve atribuir pontuação
- RF06: Usuário deve visualizar progresso
- RF07: Admin deve gerenciar conteúdos

---

## 8. Requisitos Não Funcionais

- RNF01: Segurança com HTTPS, JWT, CORS
- RNF02: Escalabilidade (arquitetura em microserviços)
- RNF03: Performance (respostas rápidas)
- RNF04: Disponibilidade alta
- RNF05: Execução segura de código

---

## 9. Arquitetura Tecnológica

### Frontend
- Next.js (SSR + SPA)

### Backend
- Node.js + Express
- APIs RESTful

### Banco de Dados
- PostgreSQL

### Automação
- IA para correção de código

### Infraestrutura
- Docker
- Discloud (frontend)
- Discloud (backend e DB)

---

## 10. Segurança

### Aplicação
- Autenticação JWT/OAuth
- Proteção contra CSRF/CORS
- Sanitização de dados

### Execução de Código
- Containers isolados
- Limite de tempo e recursos
- Logs e auditoria

---

## 11. Fluxo do Usuário

1. Usuário cria conta
2. Acessa lista de exercícios
3. Resolve e envia código
4. Sistema corrige automaticamente
5. Usuário recebe feedback
6. Ganha pontos e evolui de nível

---

## 12. Roadmap

### Fase 1 — MVP
- Autenticação
- Exercícios básicos
- Correção automática simples

### Fase 2 — Gamificação
- Pontos, níveis, badges
- Dashboard

### Fase 3 — Escala e Melhorias
- Novas linguagens
- Ranking
- Desafios diários

### Fase 4 — Expansão
- Funcionalidades sociais
- IA para personalização

---

## 13. Métricas de Sucesso

- Taxa de retenção de usuários
- Tempo médio de uso
- Número de exercícios resolvidos
- Taxa de conclusão
- Engajamento (XP ganho)

---

## 14. Riscos

- Execução insegura de código
- Baixa adoção inicial
- Complexidade na correção automática
- Escalabilidade da infraestrutura

---

## 15. Futuras Melhorias

- IA para recomendação de exercícios
- Sistema de mentoria
- Fóruns e comunidade
- Integração com plataformas educacionais