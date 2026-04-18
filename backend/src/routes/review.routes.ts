import { Router } from 'express';
import { ReviewController, createReviewSchema } from '../controllers/ReviewController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const controller = new ReviewController();

router.use(authMiddleware);

router.post('/', validate(createReviewSchema), controller.create);
router.get('/me', controller.getMe);
router.get('/given', controller.getGiven);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
