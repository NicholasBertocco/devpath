"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLesson = exports.getLessonById = exports.getLessons = exports.createLesson = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const lessonSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    content: zod_1.z.string().min(10),
    language: zod_1.z.enum(['logic', 'javascript', 'python']).default('logic'),
    xpReward: zod_1.z.number().int().positive().default(50),
});
const createLesson = async (req, res) => {
    try {
        const data = lessonSchema.parse(req.body);
        if (!req.user) {
            res.status(401).json({ error: 'Não autorizado' });
            return;
        }
        const lesson = await prisma_1.prisma.lesson.create({
            data: {
                ...data,
                authorId: req.user.id,
            },
        });
        res.status(201).json(lesson);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const zodErr = error;
            res.status(400).json({ error: zodErr.errors[0]?.message || 'Dados inválidos' });
        }
        else {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar aula.' });
        }
    }
};
exports.createLesson = createLesson;
const getLessons = async (req, res) => {
    try {
        const userId = req.user?.id;
        // Busca todas as aulas
        const lessons = await prisma_1.prisma.lesson.findMany({
            select: {
                id: true,
                title: true,
                language: true,
                xpReward: true,
                author: { select: { name: true } },
                progresses: userId ? {
                    where: { userId }
                } : false
            },
            orderBy: { createdAt: 'asc' }
        });
        // Formata para dizer se o aluno atual já completou a aula
        const formattedLessons = lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            language: lesson.language,
            xpReward: lesson.xpReward,
            authorName: lesson.author.name,
            isCompleted: lesson.progresses && lesson.progresses.length > 0
        }));
        res.status(200).json(formattedLessons);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar aulas.' });
    }
};
exports.getLessons = getLessons;
const getLessonById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: { id },
            include: {
                author: { select: { name: true } },
                progresses: userId ? { where: { userId } } : false
            }
        });
        if (!lesson) {
            res.status(404).json({ error: 'Aula não encontrada.' });
            return;
        }
        res.status(200).json({
            ...lesson,
            isCompleted: lesson.progresses && lesson.progresses.length > 0
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar aula.' });
    }
};
exports.getLessonById = getLessonById;
const completeLesson = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Não autorizado' });
            return;
        }
        const lesson = await prisma_1.prisma.lesson.findUnique({ where: { id } });
        if (!lesson) {
            res.status(404).json({ error: 'Aula não encontrada.' });
            return;
        }
        // Verifica se já completou
        const existingProgress = await prisma_1.prisma.userLessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId: id } }
        });
        if (existingProgress) {
            res.status(400).json({ error: 'Aula já foi completada anteriormente.' });
            return;
        }
        // Registra o progresso
        await prisma_1.prisma.userLessonProgress.create({
            data: { userId, lessonId: id }
        });
        // Atualiza o XP do usuário
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        let newLevel = user?.level;
        let xpGained = lesson.xpReward;
        if (user) {
            const newXp = user.xp + xpGained;
            newLevel = Math.floor(newXp / 100) + 1;
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { xp: newXp, level: newLevel }
            });
        }
        // Lógica de Badges (Conquistas) para Aulas
        const completedCount = await prisma_1.prisma.userLessonProgress.count({
            where: { userId }
        });
        if (completedCount === 1) {
            let readBadge = await prisma_1.prisma.badge.findFirst({ where: { name: 'Primeira Leitura' } });
            if (!readBadge) {
                readBadge = await prisma_1.prisma.badge.create({
                    data: { name: 'Primeira Leitura', description: 'Você completou sua primeira aula teórica!', imageUrl: '📖' }
                });
            }
            await prisma_1.prisma.userBadge.upsert({
                where: { userId_badgeId: { userId, badgeId: readBadge.id } },
                update: {},
                create: { userId, badgeId: readBadge.id }
            });
        }
        if (completedCount === 5) {
            let scholarBadge = await prisma_1.prisma.badge.findFirst({ where: { name: 'Estudioso' } });
            if (!scholarBadge) {
                scholarBadge = await prisma_1.prisma.badge.create({
                    data: { name: 'Estudioso', description: 'Você leu 5 aulas! O conhecimento é o seu maior poder.', imageUrl: '📚' }
                });
            }
            await prisma_1.prisma.userBadge.upsert({
                where: { userId_badgeId: { userId, badgeId: scholarBadge.id } },
                update: {},
                create: { userId, badgeId: scholarBadge.id }
            });
        }
        res.status(200).json({
            message: 'Aula completada com sucesso!',
            xpGained,
            newLevel
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao completar a aula.' });
    }
};
exports.completeLesson = completeLesson;
