import { Request, Response } from 'express';
import { generateApiKey, deleteApiKey } from '../services/apiKeyService';
// import { log } from 'console';

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const generateApiKeyController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  // console.log("userId:" ,userId);
  
  if (userId === undefined) {  
    return res.status(400).json({ error: 'User ID not found in request' });
  }

  try {
    const apiKey = await generateApiKey(userId.toString());  
    return res.status(201).json({ apiKey });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteApiKeyController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (userId === undefined) {  
    return res.status(400).json({ error: 'User ID not found in request' });
  }

  try {
    await deleteApiKey(userId.toString());  
    return res.status(204).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
