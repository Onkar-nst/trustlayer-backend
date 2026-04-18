import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const controller = new AdminController();

router.use(authMiddleware, adminMiddleware);

router.get('/identity/pending', controller.getPendingIdentities);
router.post('/identity/:id/approve', controller.approveIdentity);
router.post('/identity/:id/reject', controller.rejectIdentity);

router.get('/disputes', controller.getDisputes);
router.patch('/disputes/:id/resolve', controller.resolveDispute);

router.get('/users', controller.getUsers);
router.get('/stats', controller.getStats);

export default router;
