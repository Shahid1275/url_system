import { Router } from 'express';
import { generateApiKeyController, deleteApiKeyController } from '../controllers/apiKeyController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/generate', authMiddleware, generateApiKeyController);
router.delete('/delete', authMiddleware, deleteApiKeyController);

export default router;
