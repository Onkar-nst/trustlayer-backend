import { Router } from 'express';
import { AuditController } from '../controllers/AuditController';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const controller = new AuditController();

router.get('/me', authMiddleware, controller.getMe);
router.get('/admin', authMiddleware, adminMiddleware, controller.getAll);

export default router;
