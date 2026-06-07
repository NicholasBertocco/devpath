"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = void 0;
const prisma_1 = require("../lib/prisma");
const getLeaderboard = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const topUsers = await prisma_1.prisma.user.findMany({
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
    }
    catch (error) {
        console.error("Erro ao buscar ranking:", error);
        res.status(500).json({ error: 'Erro interno ao carregar o ranking.' });
    }
};
exports.getLeaderboard = getLeaderboard;
