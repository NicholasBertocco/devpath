import { Router } from 'express';
import { createExercise, getExercises, getExerciseById } from '../controllers/ExerciseController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';

const router = Router();

// Todas as rotas de exercícios requerem autenticação
router.use(authenticate);

// Alunos, Instrutores e Admins podem listar os exercícios
router.get('/', getExercises);
router.get('/:id', getExerciseById);

// Apenas Instrutores e Admins podem criar exercícios
router.post('/', authorizeRole(['INSTRUCTOR', 'ADMIN']), createExercise);

export default router;
