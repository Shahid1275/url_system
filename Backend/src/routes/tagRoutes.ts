import { Router } from 'express';
import {
    createTag,
    updateTag,
    deleteTag
} from '../controllers/tag'; 
import { authMiddleware } from '../middlewares/auth';

const router = Router();
router.post('/tags',authMiddleware, createTag);
router.put('/tags/:id',authMiddleware, updateTag);
router.delete('/tags/:id',authMiddleware, deleteTag);

export default router;
