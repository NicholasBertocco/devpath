import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...\n");

  // ─── Limpa o banco na ordem correta ────────────────────────────────────────
  await prisma.submission.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  // ─── Usuários ───────────────────────────────────────────────────────────────
  const hash = (pwd: string) => bcrypt.hashSync(pwd, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin DevPath",
      email: "admin@devpath.com",
      password: hash("admin123"),
      role: Role.ADMIN,
      xp: 9999,
      level: 10,
    },
  });

  const instructor = await prisma.user.create({
    data: {
      name: "Prof. Carlos Silva",
      email: "prof@devpath.com",
      password: hash("prof123"),
      role: Role.INSTRUCTOR,
      xp: 3200,
      level: 7,
    },
  });

  const joao = await prisma.user.create({
    data: {
      name: "João Souza",
      email: "joao@devpath.com",
      password: hash("aluno123"),
      role: Role.STUDENT,
      xp: 1850,
      level: 5,
    },
  });

  const maria = await prisma.user.create({
    data: {
      name: "Maria Oliveira",
      email: "maria@devpath.com",
      password: hash("aluno123"),
      role: Role.STUDENT,
      xp: 1200,
      level: 4,
    },
  });

  const ana = await prisma.user.create({
    data: {
      name: "Ana Lima",
      email: "ana@devpath.com",
      password: hash("aluno123"),
      role: Role.STUDENT,
      xp: 950,
      level: 3,
    },
  });

  const pedro = await prisma.user.create({
    data: {
      name: "Pedro Costa",
      email: "pedro@devpath.com",
      password: hash("aluno123"),
      role: Role.STUDENT,
      xp: 420,
      level: 2,
    },
  });

  const carlos = await prisma.user.create({
    data: {
      name: "Carlos Mendes",
      email: "carlos@devpath.com",
      password: hash("aluno123"),
      role: Role.STUDENT,
      xp: 80,
      level: 1,
    },
  });

  console.log("✅ Usuários criados");

  // ─── Badges ─────────────────────────────────────────────────────────────────
  const badgePrimeiroPasso = await prisma.badge.create({
    data: {
      name: "Primeiro Passo",
      description: "Completou o seu primeiro exercício.",
    },
  });

  const badgeMaratonista = await prisma.badge.create({
    data: {
      name: "Maratonista",
      description: "Completou 5 exercícios com sucesso.",
    },
  });

  const badgeEstudioso = await prisma.badge.create({
    data: {
      name: "Estudioso",
      description: "Completou 3 aulas na plataforma.",
    },
  });

  const badgeMestreJS = await prisma.badge.create({
    data: {
      name: "Mestre do JavaScript",
      description: "Completou todos os exercícios de JavaScript.",
    },
  });

  const badgeVelocista = await prisma.badge.create({
    data: {
      name: "Velocista",
      description: "Resolveu um exercício na primeira tentativa.",
    },
  });

  console.log("✅ Badges criadas");

  // ─── Aulas ──────────────────────────────────────────────────────────────────
  const lesson1 = await prisma.lesson.create({
    data: {
      title: "Introdução à Lógica de Programação",
      language: "logic",
      xpReward: 50,
      authorId: instructor.id,
      content: `# Introdução à Lógica de Programação

Bem-vindo ao DevPath! Nesta aula você aprenderá os conceitos fundamentais da lógica de programação.

## O que é Lógica de Programação?

Lógica de programação é a técnica de encadear pensamentos para atingir determinado objetivo. É a base para qualquer linguagem de programação.

## Variáveis

Uma **variável** é um espaço na memória do computador onde guardamos informações.

\`\`\`javascript
let nome = "João";
let idade = 25;
let ativo = true;
\`\`\`

## Tipos de Dados

| Tipo | Exemplo | Descrição |
|------|---------|-----------|
| String | \`"Olá"\` | Texto |
| Number | \`42\` | Número |
| Boolean | \`true\` | Verdadeiro ou falso |

## Operadores

\`\`\`javascript
// Aritméticos
let soma = 10 + 5;      // 15
let sub  = 10 - 5;      // 5
let mult = 10 * 5;      // 50
let div  = 10 / 5;      // 2

// Comparação
10 > 5   // true
10 === 5 // false
\`\`\`

## Estruturas Condicionais

\`\`\`javascript
let nota = 7;

if (nota >= 7) {
  console.log("Aprovado!");
} else {
  console.log("Reprovado.");
}
\`\`\`

## Exercício Mental

Tente prever a saída:

\`\`\`javascript
let x = 10;
let y = 3;
console.log(x % y); // ?
\`\`\`

> **Resposta:** \`1\` — o operador \`%\` retorna o resto da divisão.

Parabéns por concluir sua primeira aula! 🎉
`,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: "Funções em JavaScript",
      language: "javascript",
      xpReward: 75,
      authorId: instructor.id,
      content: `# Funções em JavaScript

Funções são blocos de código reutilizáveis que executam uma tarefa específica.

## Declarando uma Função

\`\`\`javascript
function saudacao(nome) {
  return "Olá, " + nome + "!";
}

console.log(saudacao("Maria")); // "Olá, Maria!"
\`\`\`

## Arrow Functions

A forma moderna de escrever funções em JavaScript:

\`\`\`javascript
const saudacao = (nome) => "Olá, " + nome + "!";

// Com múltiplas linhas
const soma = (a, b) => {
  const resultado = a + b;
  return resultado;
};
\`\`\`

## Parâmetros e Retorno

\`\`\`javascript
function calcularMedia(nota1, nota2, nota3) {
  const soma = nota1 + nota2 + nota3;
  return soma / 3;
}

const media = calcularMedia(8, 7, 9);
console.log(media); // 8
\`\`\`

## Funções como Valores

Em JavaScript, funções são cidadãs de primeira classe — podem ser armazenadas em variáveis e passadas como argumentos:

\`\`\`javascript
const dobrar = (n) => n * 2;
const numeros = [1, 2, 3, 4, 5];

const dobrados = numeros.map(dobrar);
console.log(dobrados); // [2, 4, 6, 8, 10]
\`\`\`

## Escopo

Variáveis declaradas dentro de uma função não são acessíveis fora dela:

\`\`\`javascript
function minhaFuncao() {
  let segredo = "só eu sei";
}

console.log(segredo); // ReferenceError!
\`\`\`

Ótimo trabalho! Agora pratique resolvendo os exercícios de funções. 💪
`,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      title: "Arrays e Iteração",
      language: "javascript",
      xpReward: 75,
      authorId: instructor.id,
      content: `# Arrays e Iteração em JavaScript

Arrays são listas ordenadas de valores. São uma das estruturas de dados mais usadas em programação.

## Criando Arrays

\`\`\`javascript
const frutas = ["maçã", "banana", "laranja"];
const numeros = [1, 2, 3, 4, 5];
const misto = [1, "texto", true, null];
\`\`\`

## Acessando Elementos

\`\`\`javascript
const frutas = ["maçã", "banana", "laranja"];

console.log(frutas[0]); // "maçã"   (índice começa em 0)
console.log(frutas[2]); // "laranja"
console.log(frutas.length); // 3
\`\`\`

## Métodos Essenciais

\`\`\`javascript
const nums = [3, 1, 4, 1, 5, 9];

// Adicionar / Remover
nums.push(2);       // adiciona no fim
nums.pop();         // remove do fim
nums.unshift(0);    // adiciona no início

// Buscar
nums.includes(4);   // true
nums.indexOf(1);    // 1

// Transformar
const dobrados = nums.map(n => n * 2);
const pares    = nums.filter(n => n % 2 === 0);
const soma     = nums.reduce((acc, n) => acc + n, 0);
\`\`\`

## Iterando com for...of

\`\`\`javascript
const linguagens = ["JavaScript", "Python", "TypeScript"];

for (const lang of linguagens) {
  console.log("Eu sei " + lang);
}
\`\`\`

## Desestruturação

\`\`\`javascript
const [primeiro, segundo, ...resto] = [10, 20, 30, 40, 50];

console.log(primeiro); // 10
console.log(segundo);  // 20
console.log(resto);    // [30, 40, 50]
\`\`\`

Excelente! Você já consegue manipular listas de dados. 🚀
`,
    },
  });

  console.log("✅ Aulas criadas");

  // ─── Exercícios ─────────────────────────────────────────────────────────────
  const ex1 = await prisma.exercise.create({
    data: {
      title: "Soma de Dois Números",
      description:
        "Crie uma função chamada `solution` que recebe dois números como parâmetro e retorna a soma deles.\n\n**Exemplo:**\n```\nsolution(3, 5) → 8\nsolution(10, -2) → 8\n```",
      difficulty: "EASY",
      language: "javascript",
      points: 10,
      authorId: instructor.id,
      initialCode: "function solution(a, b) {\n  // seu código aqui\n}\n",
      testCases: {
        create: [
          { input: "3 5", expectedOutput: "8" },
          { input: "10 -2", expectedOutput: "8" },
          { input: "0 0", expectedOutput: "0" },
          { input: "-5 -3", expectedOutput: "-8", isHidden: true },
          { input: "100 200", expectedOutput: "300", isHidden: true },
        ],
      },
    },
  });

  const ex2 = await prisma.exercise.create({
    data: {
      title: "Par ou Ímpar",
      description:
        "Crie uma função chamada `solution` que recebe um número inteiro e retorna a string `'par'` se o número for par, ou `'impar'` se for ímpar.\n\n**Exemplo:**\n```\nsolution(4) → 'par'\nsolution(7) → 'impar'\n```",
      difficulty: "EASY",
      language: "javascript",
      points: 10,
      authorId: instructor.id,
      initialCode: "function solution(n) {\n  // seu código aqui\n}\n",
      testCases: {
        create: [
          { input: "4", expectedOutput: "par" },
          { input: "7", expectedOutput: "impar" },
          { input: "0", expectedOutput: "par" },
          { input: "-3", expectedOutput: "impar", isHidden: true },
          { input: "100", expectedOutput: "par", isHidden: true },
        ],
      },
    },
  });

  const ex3 = await prisma.exercise.create({
    data: {
      title: "Maior de Três Números",
      description:
        "Crie uma função chamada `solution` que recebe três números e retorna o maior deles.\n\n**Exemplo:**\n```\nsolution(3, 7, 2) → 7\nsolution(10, 10, 5) → 10\n```",
      difficulty: "MEDIUM",
      language: "javascript",
      points: 20,
      authorId: instructor.id,
      initialCode: "function solution(a, b, c) {\n  // seu código aqui\n}\n",
      testCases: {
        create: [
          { input: "3 7 2", expectedOutput: "7" },
          { input: "10 10 5", expectedOutput: "10" },
          { input: "-1 -5 -3", expectedOutput: "-1" },
          { input: "0 0 0", expectedOutput: "0", isHidden: true },
          { input: "999 1000 998", expectedOutput: "1000", isHidden: true },
        ],
      },
    },
  });

  const ex4 = await prisma.exercise.create({
    data: {
      title: "Fatorial",
      description:
        "Crie uma função chamada `solution` que recebe um número inteiro não-negativo `n` e retorna o seu fatorial.\n\nLembre-se: `0! = 1` e `n! = n × (n-1)!`\n\n**Exemplo:**\n```\nsolution(5) → 120\nsolution(0) → 1\n```",
      difficulty: "MEDIUM",
      language: "javascript",
      points: 20,
      authorId: instructor.id,
      initialCode: "function solution(n) {\n  // seu código aqui\n}\n",
      testCases: {
        create: [
          { input: "5", expectedOutput: "120" },
          { input: "0", expectedOutput: "1" },
          { input: "1", expectedOutput: "1" },
          { input: "3", expectedOutput: "6" },
          { input: "10", expectedOutput: "3628800", isHidden: true },
        ],
      },
    },
  });

  const ex5 = await prisma.exercise.create({
    data: {
      title: "Sequência de Fibonacci",
      description:
        "Crie uma função chamada `solution` que recebe um número `n` e retorna o n-ésimo elemento da sequência de Fibonacci (começando do índice 0).\n\nSequência: `0, 1, 1, 2, 3, 5, 8, 13, 21, ...`\n\n**Exemplo:**\n```\nsolution(0) → 0\nsolution(6) → 8\n```",
      difficulty: "HARD",
      language: "javascript",
      points: 40,
      authorId: instructor.id,
      initialCode: "function solution(n) {\n  // seu código aqui\n}\n",
      testCases: {
        create: [
          { input: "0", expectedOutput: "0" },
          { input: "1", expectedOutput: "1" },
          { input: "6", expectedOutput: "8" },
          { input: "10", expectedOutput: "55", isHidden: true },
          { input: "15", expectedOutput: "610", isHidden: true },
        ],
      },
    },
  });

  console.log("✅ Exercícios e casos de teste criados");

  // ─── Submissões ─────────────────────────────────────────────────────────────
  await prisma.submission.createMany({
    data: [
      // João — resolveu tudo
      {
        userId: joao.id,
        exerciseId: ex1.id,
        code: "function soma(a, b) { return a + b; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: joao.id,
        exerciseId: ex2.id,
        code: "function parOuImpar(n) { return n % 2 === 0 ? 'par' : 'impar'; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: joao.id,
        exerciseId: ex3.id,
        code: "function maiorDeTres(a, b, c) { return Math.max(a, b, c); }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: joao.id,
        exerciseId: ex4.id,
        code: "function fatorial(n) { return n <= 1 ? 1 : n * fatorial(n - 1); }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: joao.id,
        exerciseId: ex5.id,
        code: "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      // Maria — resolveu parcialmente
      {
        userId: maria.id,
        exerciseId: ex1.id,
        code: "function soma(a, b) { return a + b; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: maria.id,
        exerciseId: ex2.id,
        code: "function parOuImpar(n) { return n % 2 === 0 ? 'par' : 'impar'; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: maria.id,
        exerciseId: ex3.id,
        code: "function maiorDeTres(a, b, c) { if (a > b && a > c) return a; if (b > c) return b; return c; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: maria.id,
        exerciseId: ex4.id,
        code: "function fatorial(n) { return n * fatorial(n); }",
        status: "FAILED",
        feedback: "Erro: Maximum call stack size exceeded.",
      },
      // Ana — tentativas
      {
        userId: ana.id,
        exerciseId: ex1.id,
        code: "function soma(a, b) { return a + b; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: ana.id,
        exerciseId: ex2.id,
        code: "function parOuImpar(n) { if (n % 2 == 0) return 'par'; return 'impar'; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: ana.id,
        exerciseId: ex3.id,
        code: "function maiorDeTres(a, b, c) { return a; }",
        status: "FAILED",
        feedback: "Falhou em 3 de 5 casos de teste.",
      },
      // Pedro — apenas começou
      {
        userId: pedro.id,
        exerciseId: ex1.id,
        code: "function soma(a, b) { return a + b; }",
        status: "SUCCESS",
        feedback: "Todos os testes passaram! ✅",
      },
      {
        userId: pedro.id,
        exerciseId: ex2.id,
        code: "function parOuImpar(n) { return n % 2; }",
        status: "FAILED",
        feedback: "Esperado 'par', recebido '0'.",
      },
      // Carlos — primeiro exercício com erro
      {
        userId: carlos.id,
        exerciseId: ex1.id,
        code: "function soma(a, b) { console.log(a + b); }",
        status: "FAILED",
        feedback: "A função deve retornar o valor, não usar console.log.",
      },
    ],
  });

  console.log("✅ Submissões criadas");

  // ─── Progresso nas Aulas ────────────────────────────────────────────────────
  await prisma.userLessonProgress.createMany({
    data: [
      { userId: joao.id, lessonId: lesson1.id },
      { userId: joao.id, lessonId: lesson2.id },
      { userId: joao.id, lessonId: lesson3.id },
      { userId: maria.id, lessonId: lesson1.id },
      { userId: maria.id, lessonId: lesson2.id },
      { userId: maria.id, lessonId: lesson3.id },
      { userId: ana.id, lessonId: lesson1.id },
      { userId: ana.id, lessonId: lesson2.id },
      { userId: pedro.id, lessonId: lesson1.id },
    ],
  });

  console.log("✅ Progresso nas aulas registrado");

  // ─── Badges para os usuários ────────────────────────────────────────────────
  await prisma.userBadge.createMany({
    data: [
      // João — todas as badges
      { userId: joao.id, badgeId: badgePrimeiroPasso.id },
      { userId: joao.id, badgeId: badgeMaratonista.id },
      { userId: joao.id, badgeId: badgeEstudioso.id },
      { userId: joao.id, badgeId: badgeMestreJS.id },
      { userId: joao.id, badgeId: badgeVelocista.id },
      // Maria
      { userId: maria.id, badgeId: badgePrimeiroPasso.id },
      { userId: maria.id, badgeId: badgeEstudioso.id },
      { userId: maria.id, badgeId: badgeVelocista.id },
      // Ana
      { userId: ana.id, badgeId: badgePrimeiroPasso.id },
      { userId: ana.id, badgeId: badgeVelocista.id },
      // Pedro
      { userId: pedro.id, badgeId: badgePrimeiroPasso.id },
    ],
  });

  console.log("✅ Badges distribuídas\n");
  console.log("🎉 Seed concluído com sucesso!");
  console.log("\n📋 Credenciais para teste:");
  console.log("   Admin:      admin@devpath.com  / admin123");
  console.log("   Instrutor:  prof@devpath.com   / prof123");
  console.log(
    "   Aluno 1:    joao@devpath.com   / aluno123  (nível 5, 1850 XP)",
  );
  console.log(
    "   Aluno 2:    maria@devpath.com  / aluno123  (nível 4, 1200 XP)",
  );
  console.log(
    "   Aluno 3:    ana@devpath.com    / aluno123  (nível 3,  950 XP)",
  );
  console.log(
    "   Aluno 4:    pedro@devpath.com  / aluno123  (nível 2,  420 XP)",
  );
  console.log(
    "   Aluno 5:    carlos@devpath.com / aluno123  (nível 1,   80 XP)",
  );
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
