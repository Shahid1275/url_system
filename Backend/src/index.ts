import express,{json} from 'express'
import { PORT } from './secrets';
import cors from 'cors'
import tagRoutes from './routes/tagRoutes';
import { PrismaClient } from '@prisma/client';
import apiKeyRoutes from './routes/apiKeyRoutes';

const app = express()
app.use(cors())
app.use(json());
app.use('/api', tagRoutes);
app.use('/api-key', apiKeyRoutes);

import rootRouter from './routes';
app.use('/api',(req,res,next)=>{
    next()
}, rootRouter);

export const prismaClient = new PrismaClient({
    log:['query']
})

app.listen(PORT, () =>{
    console.log("App is working good")
}); 