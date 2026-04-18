import { Router } from 'express';
import { TransactionController, createTransactionSchema } from '../controllers/TransactionController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const controller = new TransactionController();

router.use(authMiddleware);

router.post('/', validate(createTransactionSchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id/complete', controller.complete);
router.patch('/:id/fail', controller.fail);

export default router;
