import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const topUsers = await prisma.user.findMany({
      where: {
        role: 'STUDENT', // Apenas alunos aparecem no ranking principal
      },
      select: {
        id: true,
        name: true,
        xp: true,
        level: true,
      },
      orderBy: {
        xp: 'desc',
      },
      take: limit,
    });

    res.status(200).json(topUsers);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: 'Erro interno ao carregar o ranking.' });
  }
};
