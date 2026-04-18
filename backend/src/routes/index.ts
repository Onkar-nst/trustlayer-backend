import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import identityRoutes from './identity.routes';
import transactionRoutes from './transaction.routes';
import reviewRoutes from './review.routes';
import trustRoutes from './trust.routes';
import disputeRoutes from './dispute.routes';
import adminRoutes from './admin.routes';
import auditRoutes from './audit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/identity', identityRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reviews', reviewRoutes);
router.use('/trust', trustRoutes);
router.use('/disputes', disputeRoutes);
router.use('/admin', adminRoutes);
router.use('/audit', auditRoutes);

export default router;
