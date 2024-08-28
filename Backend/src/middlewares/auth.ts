import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: number;  
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    console.log(decoded,"KKKKKK");
    
    req.userId = decoded.userId; 
    next();  
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
