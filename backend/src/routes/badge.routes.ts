import { Router } from 'express';
import { getUserBadges } from '../controllers/BadgeController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getUserBadges);

export default router;
