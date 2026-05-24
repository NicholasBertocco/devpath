import { Router } from 'express';
import { createLesson, getLessons, getLessonById, completeLesson } from '../controllers/LessonController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

// Públicas para alunos
router.get('/', getLessons);
router.get('/:id', getLessonById);
router.post('/:id/complete', completeLesson);

// Restritas para instrutores/admins
router.post('/', authorizeRole(['INSTRUCTOR', 'ADMIN']), createLesson);

export default router;
