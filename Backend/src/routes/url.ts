import express from 'express';
import { getAllUrls, getUrlById, createUrl, updateUrl, deleteUrl, createManyUrls } from '../controllers/url';
import { redirectUrl} from '../controllers/redirectUrl';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();
router.get('/redirect/:short_url', redirectUrl);
router.get('/', authMiddleware, getAllUrls);
 router.get('/:id',authMiddleware,  getUrlById);
router.post('/', authMiddleware, createUrl);
router.put('/:id',authMiddleware,  updateUrl);
router.post('/batch',authMiddleware,  createManyUrls);
router.delete('/:id', authMiddleware, deleteUrl);
export default router;
