import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().default(false),
});

const createExerciseSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('EASY'),
  language: z.string().default('javascript'),
  initialCode: z.string().optional(),
  points: z.number().int().positive().default(10),
  testCases: z.array(testCaseSchema).min(1, "É necessário pelo menos um caso de teste."),
});

export const createExercise = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createExerciseSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const exercise = await prisma.exercise.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        language: data.language,
        initialCode: data.initialCode || '',
        points: data.points,
        authorId: req.user.id,
        testCases: {
          create: data.testCases,
        },
      },
      include: {
        testCases: true,
      },
    });

    res.status(201).json(exercise);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const zodErr = error as any;
      res.status(400).json({ error: zodErr.errors[0]?.message || 'Dados inválidos' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro interno ao criar exercício.' });
    }
  }
};

export const getExercises = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exercises = await prisma.exercise.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        language: true,
        points: true,
        author: {
          select: { name: true }
        }
      }
    });

    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar exercícios.' });
  }
};

export const getExerciseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        testCases: {
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            isHidden: true,
          }
        },
        author: {
          select: { name: true }
        }
      }
    });

    if (!exercise) {
      res.status(404).json({ error: 'Exercício não encontrado.' });
      return;
    }

    // Se o usuário for STUDENT, não enviamos os outputs dos testes ocultos.
    let testCases = exercise.testCases;
    if (req.user?.role === 'STUDENT') {
      testCases = exercise.testCases.map((tc: any) => {
        if (tc.isHidden) {
          return { ...tc, expectedOutput: 'HIDDEN' };
        }
        return tc;
      });
    }

    res.status(200).json({ ...exercise, testCases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar exercício.' });
  }
};
