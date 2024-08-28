
import { Request, Response } from 'express';
import { prismaClient } from '..'; 

export const redirectUrl = async (req: Request, res: Response) => {
    const { short_url } = req.params;
    // const { ip_address, user_agent } = req.body; 
const ip_address = Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || '';
  
    const user_agent:string | undefined = req.headers['user-agent'] || '';
       try {
        const urlRecord = await prismaClient.url.findUnique({
            where: { short_url },
        });

    
        if (!urlRecord || urlRecord.is_deleted) {
            return res.status(404).json({ error: 'URL not found or has been deleted' });
        }
    
        const originalUrl = urlRecord.original_url;
        if (originalUrl && /^https?:\/\//i.test(originalUrl)) {
            console.log(ip_address,user_agent,"Subhan")
            await prismaClient.url_click.create({
                data: {
                    url_id: urlRecord.url_id,
                    access_date: new Date(),
                    access_time: new Date(),
                    
                     ip_address,
                    user_agent,
                },
            });

            return res.redirect(originalUrl);
        } else {
            return res.status(500).json({ error: 'Original URL is missing or invalid' });
        }
    } catch (error) {
        console.error('Error in redirectUrl:', error);
        return res.status(500).json({ msg: 'Failed to redirect',error });
    }
};
