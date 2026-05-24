import { Router } from 'express';
import { getLeaderboard } from '../controllers/RankingController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getLeaderboard);

export default router;
