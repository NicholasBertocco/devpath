"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../utils/auth");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: zod_1.z.string().email("E-mail inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    role: zod_1.z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = async (req, res) => {
    try {
        const { name, email, password, role } = registerSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'E-mail já está em uso.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
            },
        });
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level,
            },
            token,
        });
    }
    catch (error) {
        if (error?.name === 'ZodError') {
            res.status(400).json({ error: error.errors });
        }
        else {
            console.error("Register error:", error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas.' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Credenciais inválidas.' });
            return;
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level,
            },
            token,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const zodErr = error;
            const errorMessage = zodErr.errors && zodErr.errors.length > 0
                ? zodErr.errors[0].message
                : 'Dados de entrada inválidos';
            res.status(400).json({ error: errorMessage });
        }
        else {
            console.error("Login error:", error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
};
exports.login = login;
