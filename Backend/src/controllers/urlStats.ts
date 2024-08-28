import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
export const getUrlStatsByUrlId = async (req: Request, res: Response) => {
  const { url_id } = req.params;
console.log(`url_id: ${url_id}`);
  try {
    const urlStats = await prisma.url_click.findMany({
      where: {
        url_id: url_id,
        is_deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!urlStats || urlStats.length === 0) {
      return res.status(200).json({ message: "No statistics found for this URL." });
    }
    console.log(urlStats,"--------------------------------\n");
    return res.status(200).json(urlStats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch URL statistics." });
  }
};
