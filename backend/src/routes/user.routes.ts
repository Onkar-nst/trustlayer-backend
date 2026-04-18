import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const controller = new UserController();

router.get('/:id', controller.getProfile);
router.get('/:id/reviews', controller.getProfile); // Reusing for now or could have specific one
router.get('/search', controller.search);

export default router;
