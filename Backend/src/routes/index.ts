
import { Router } from 'express';
import authRoutes from './auth';
import urlRoutes from './url';
import statsRoutes from './urlStatsRoute' 
const rootRouter: Router = Router();
import apikeyRoutes from './apiKeyRoutes'
rootRouter.use('/api-key', apikeyRoutes)
rootRouter.use('/auth', authRoutes);
rootRouter.use('/urls', urlRoutes);
rootRouter.use('/stats',statsRoutes)
export default rootRouter;

