import { Router } from 'express';
import { DisputeController, createDisputeSchema } from '../controllers/DisputeController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const controller = new DisputeController();

router.use(authMiddleware);

router.post('/', validate(createDisputeSchema), controller.create);
router.get('/me', controller.getMe);

export default router;
