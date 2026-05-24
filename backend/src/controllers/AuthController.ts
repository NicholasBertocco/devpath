import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { generateToken } from '../utils/auth';

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'E-mail já está em uso.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
      },
    });

    const token = generateToken(user.id, user.role);

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
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Register error:", error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = generateToken(user.id, user.role);

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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const zodErr = error as any;
      const errorMessage = zodErr.errors && zodErr.errors.length > 0 
        ? zodErr.errors[0].message 
        : 'Dados de entrada inválidos';
      res.status(400).json({ error: errorMessage });
    } else {
      console.error("Login error:", error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};
