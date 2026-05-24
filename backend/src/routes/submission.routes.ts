import { Router } from 'express';
import { createSubmission } from '../controllers/SubmissionController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', createSubmission);

export default router;
