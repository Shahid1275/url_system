import express from 'express';
import { getUrlStatsByUrlId } from '../controllers/urlStats';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/:url_id',authMiddleware,  getUrlStatsByUrlId);

export default router;
