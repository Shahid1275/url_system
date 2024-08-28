import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createTag = async (req: Request, res: Response) => {
    try {
        const { user_id, tag_name } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const newTag = await prisma.url_tag.create({
            data: {
                user_id,
                tag_name,
            },
        });

        res.status(201).json(newTag);
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({ error: 'Error creating tag' });
    }
};

// Update an existing Tag
export const updateTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tag_name } = req.body;
    try {
        const updatedTag = await prisma.url_tag.update({
            where: { tag_id: parseInt(id) },
            data: {
                tag_name,
                updated_at: new Date(), // Update timestamp
            },
        });
        res.status(200).json(updatedTag);
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ error: 'Failed to update tag' });
    }
};

// Soft delete a Tag
export const deleteTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.url_tag.update({
            where: { tag_id: parseInt(id) },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
            },
        });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Failed to delete tag' });
    }
};
