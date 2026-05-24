import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CodeSandboxService } from '../services/CodeSandboxService';

const submissionSchema = z.object({
  exerciseId: z.string().uuid(),
  code: z.string().min(1),
});

export const createSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { exerciseId, code } = submissionSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const userId = req.user.id;

    // Busca o exercício com os casos de teste
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { testCases: true },
    });

    if (!exercise) {
      res.status(404).json({ error: 'Exercício não encontrado.' });
      return;
    }

    let allTestsPassed = true;
    let failedTestsCount = 0;
    let feedbackDetails = [];

    // Executa o código para cada caso de teste
    for (const testCase of exercise.testCases) {
      const result = CodeSandboxService.execute(
        exercise.language,
        code,
        testCase.input,
        testCase.expectedOutput
      );

      if (!result.passed) {
        allTestsPassed = false;
        failedTestsCount++;
      }

      // Oculta os detalhes se o teste for "hidden" e o aluno errar,
      // para que ele não veja a saída esperada secreta.
      feedbackDetails.push({
        input: testCase.isHidden ? 'HIDDEN' : testCase.input,
        expected: testCase.isHidden ? 'HIDDEN' : testCase.expectedOutput,
        actual: testCase.isHidden ? 'HIDDEN' : result.actualOutput,
        passed: result.passed,
        error: result.error
      });
    }

    const status = allTestsPassed ? 'SUCCESS' : 'FAILED';
    const feedbackMessage = allTestsPassed 
      ? 'Parabéns! Todo o seu código passou nos testes.' 
      : `Você falhou em ${failedTestsCount} caso(s) de teste.`;

    // Salva a submissão
    const submission = await prisma.submission.create({
      data: {
        userId,
        exerciseId,
        code,
        status,
        feedback: JSON.stringify(feedbackDetails),
      }
    });

    // Se o código passou, verifica se já havia resolvido antes
    let xpGained = 0;
    let newLevel = undefined;
    
    if (allTestsPassed) {
      const previousSuccess = await prisma.submission.findFirst({
        where: {
          userId,
          exerciseId,
          status: 'SUCCESS',
          id: { not: submission.id }
        }
      });

      // Só ganha XP na primeira vez que acerta o exercício
      if (!previousSuccess) {
        xpGained = exercise.points;
        
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          const newXp = user.xp + xpGained;
          // Lógica simples de level up: a cada 100 XP sobe 1 nível
          newLevel = Math.floor(newXp / 100) + 1;
          
          await prisma.user.update({
            where: { id: userId },
            data: { xp: newXp, level: newLevel }
          });

          // LÓGICA DE CONQUISTAS (BADGES)
          // Exemplo 1: Primeira Submissão Correta ("Primeiro Passo")
          const successCount = await prisma.submission.count({
            where: { userId, status: 'SUCCESS' }
          });

          if (successCount === 1) { // Acabou de salvar a primeira, então a contagem no banco é 1
            let firstBadge = await prisma.badge.findFirst({ where: { name: 'Primeiro Passo' } });
            
            // Se a badge ainda não existir no banco, nós a criamos dinamicamente (para facilitar o MVP)
            if (!firstBadge) {
              firstBadge = await prisma.badge.create({
                data: {
                  name: 'Primeiro Passo',
                  description: 'Você resolveu seu primeiro desafio de programação!',
                  imageUrl: '🌟' // Usando emoji como imagem para simplificar
                }
              });
            }

            // Entrega a badge ao usuário
            await prisma.userBadge.upsert({
              where: {
                userId_badgeId: { userId, badgeId: firstBadge.id }
              },
              update: {},
              create: {
                userId,
                badgeId: firstBadge.id
              }
            });
          }

          // Exemplo 2: Mestre do JavaScript (resolveu 3 exercícios de JS)
          if (exercise.language === 'javascript') {
            const jsSuccessCount = await prisma.submission.count({
              where: {
                userId,
                status: 'SUCCESS',
                exercise: { language: 'javascript' }
              }
            });

            if (jsSuccessCount === 3) {
              let jsBadge = await prisma.badge.findFirst({ where: { name: 'Mestre do JavaScript' } });
              if (!jsBadge) {
                jsBadge = await prisma.badge.create({
                  data: { name: 'Mestre do JavaScript', description: 'Resolveu 3 exercícios de JavaScript!', imageUrl: '🟨' }
                });
              }
              await prisma.userBadge.upsert({
                where: { userId_badgeId: { userId, badgeId: jsBadge.id } },
                update: {},
                create: { userId, badgeId: jsBadge.id }
              });
            }
          }
        }
      }
    }

    res.status(201).json({
      submissionId: submission.id,
      status,
      message: feedbackMessage,
      details: feedbackDetails,
      xpGained,
      newLevel
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const zodErr = error as any;
      const errorMessage = zodErr.errors && zodErr.errors.length > 0 
        ? zodErr.errors[0].message 
        : 'Dados inválidos';
      res.status(400).json({ error: errorMessage });
    } else {
      console.error("Submission error:", error);
      res.status(500).json({ error: 'Erro interno do servidor ao processar submissão.' });
    }
  }
};
