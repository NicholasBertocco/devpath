"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseById = exports.getExercises = exports.createExercise = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const testCaseSchema = zod_1.z.object({
    input: zod_1.z.string(),
    expectedOutput: zod_1.z.string(),
    isHidden: zod_1.z.boolean().default(false),
});
const createExerciseSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(10),
    difficulty: zod_1.z.enum(['EASY', 'MEDIUM', 'HARD']).default('EASY'),
    language: zod_1.z.string().default('javascript'),
    initialCode: zod_1.z.string().optional(),
    points: zod_1.z.number().int().positive().default(10),
    testCases: zod_1.z.array(testCaseSchema).min(1, "É necessário pelo menos um caso de teste."),
});
const createExercise = async (req, res) => {
    try {
        const data = createExerciseSchema.parse(req.body);
        if (!req.user) {
            res.status(401).json({ error: 'Não autorizado' });
            return;
        }
        const exercise = await prisma_1.prisma.exercise.create({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const zodErr = error;
            res.status(400).json({ error: zodErr.errors[0]?.message || 'Dados inválidos' });
        }
        else {
            console.error(error);
            res.status(500).json({ error: 'Erro interno ao criar exercício.' });
        }
    }
};
exports.createExercise = createExercise;
const getExercises = async (req, res) => {
    try {
        const exercises = await prisma_1.prisma.exercise.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar exercícios.' });
    }
};
exports.getExercises = getExercises;
const getExerciseById = async (req, res) => {
    try {
        const id = req.params.id;
        const exercise = await prisma_1.prisma.exercise.findUnique({
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
            testCases = exercise.testCases.map((tc) => {
                if (tc.isHidden) {
                    return { ...tc, expectedOutput: 'HIDDEN' };
                }
                return tc;
            });
        }
        res.status(200).json({ ...exercise, testCases });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar exercício.' });
    }
};
exports.getExerciseById = getExerciseById;
