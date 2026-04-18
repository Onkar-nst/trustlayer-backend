import { Router } from 'express';
import { TrustScoreController } from '../controllers/TrustScoreController';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const controller = new TrustScoreController();

router.get('/:userId', controller.getBreakdown);
router.post('/recalculate', authMiddleware, adminMiddleware, controller.recalculate);

export default router;
