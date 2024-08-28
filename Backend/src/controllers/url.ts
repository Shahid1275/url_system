import { PrismaClient, url } from '@prisma/client';
import { log } from 'console';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// Get all URLs
export const getAllUrls = async (req: Request, res: Response) => {
    try {
        const urls = await prisma.url.findMany({
            where: { 
                is_deleted: false,
                is_pre_generated: false, 
            },
            include:{
                url_tag: true, //
            }
        });
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve URLs' });
    }
};


// Get URL by ID
export const getUrlById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const url = await prisma.url.findUnique({
            where: { url_id: id },
        });
        if (!url || url.is_deleted) { // Check for deletion
            return res.status(404).json({ error: 'URL not found' });
        }
        res.status(200).json(url);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve URL' });
    }
};

// Create a new URL
export const createUrl = async (req: Request, res: Response) => {
    try {
      const { original_url, url_type, expiration_date,tag_id } = req.body;
      const short_url: string = nanoid(8);
  
      // Format expiration_date to ISO-8601 if it exists
      let formattedExpirationDate = expiration_date
        ? new Date(expiration_date).toISOString()
        : null;

        const tag_id_num = +tag_id;
        console.log("TAG ID: ",tag_id_num)


      const newUrl = await prisma.url.create({
        data: {
          original_url,
          short_url,
          url_type,
          tag_id:tag_id_num,
          expiration_date: formattedExpirationDate,
          status: "active",
          associated_at: new Date().toISOString(), 
        },
      });
      res.status(201).json(newUrl);
    } catch (error) {
      console.error("Error creating URL:", error);
      res.status(500).json({ status: "Error creating URL",error });
    }
  };

// Create multiple URLs
export const createManyUrls = async (req: Request, res: Response) => {
    const { quantity, original_url, logo_id, tag_id, url_type, associated, expiration_date, status, associated_at } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity specified' });
    }

    try {
        const urls = [];

        for (let i = 0; i < quantity; i++) {
            const short_url: string = nanoid(8);
            const newUrl = await prisma.url.create({
                data: {
                    original_url,
                    short_url,
                    logo_id,
                    tag_id,
                    url_type,
                    associated,
                    expiration_date,
                    status,
                    associated_at,
                },
            });
            urls.push(newUrl);
        }

        res.status(201).json(urls);
    } catch (error) {
        console.error('Error creating multiple URLs:', error);
        res.status(500).json({ error: 'Failed to create URLs' });
    }
};

// Update an existing URL
export const updateUrl = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { original_url, logo_id, tag_id, url_type, associated, expiration_date, status, associated_at } = req.body;
    try {
        const updatedUrl = await prisma.url.update({
            where: { url_id: id },
            data: {
                original_url,
                logo_id,
                tag_id,
                url_type,
                associated,
                expiration_date,
                status,
                associated_at,
            },
        });
        res.status(200).json(updatedUrl);
    } catch (error) {
        console.error('Error updating URL:', error);
        res.status(500).json({ error: 'Failed to update URL' });
    }
};

// Soft delete a URL
export const deleteUrl = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const url = await prisma.url.update({
            where: { url_id: id },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
            },
            include:{
                url_tag: true
            }
        });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ error: 'Failed to delete URL' });
    }
};
export const redirectUrl = async (req: Request, res: Response) => {
    const { short_url } = req.params;

    try {
        // Find the URL with the matching short_url
        const url = await prisma.url.findUnique({
            where: { short_url },
        });

        // Handle case where URL is not found or has been deleted
        if (!url || url.is_deleted || !url.original_url) {
            return res.status(404).json({ error: "Short URL not found or has been deleted." });
        }

        // Redirect to the original URL
        res.redirect(url.original_url);
    } catch (error) {
        console.error("Error redirecting URL:", error);
        res.status(500).json({ error: "Failed to redirect to the original URL." });
    }
};
