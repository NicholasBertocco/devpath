import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getUserBadges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: {
        awardedAt: 'desc',
      },
    });

    // Mapeando para retornar um formato mais limpo
    const badges = userBadges.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      imageUrl: ub.badge.imageUrl,
      awardedAt: ub.awardedAt,
    }));

    res.status(200).json(badges);
  } catch (error) {
    console.error("Erro ao buscar badges:", error);
    res.status(500).json({ error: 'Erro interno ao buscar conquistas.' });
  }
};
