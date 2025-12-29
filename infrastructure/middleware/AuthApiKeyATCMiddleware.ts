import { AppConfig } from '@/infrastructure/config';
import { container, TYPES } from '@/infrastructure/config/inversify/index';
import { NextFunction, Request, Response } from 'express';



export async function requireAuthApiKeyATC(req: Request, res: Response, next: NextFunction) {
    try {
        const appConfig = container.get<AppConfig>(TYPES.AppConfig);

        const apiKey = req.headers['x-api-key'];
        const validApiKey = appConfig.getAPiKeyATCCallback(); // Store your API key securely, e.g., in environment variables
        if (!apiKey || apiKey !== validApiKey) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.error('Error in requireAuthApiKey middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};