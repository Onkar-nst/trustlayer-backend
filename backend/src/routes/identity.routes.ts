import { Router } from 'express';
import { IdentityController, identityUploadSchema } from '../controllers/IdentityController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const controller = new IdentityController();

router.use(authMiddleware);

router.post('/upload', validate(identityUploadSchema), controller.upload);
router.get('/status', controller.getStatus);

export default router;
