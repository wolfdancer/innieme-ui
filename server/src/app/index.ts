import express, { Request, Response } from 'express';
import cors from 'cors';
import { IConversationService } from '../services/IConversationService';

// Initialize express app
const app = express();
let conversationService: IConversationService;

export const initializeApp = (service: IConversationService) => {
    conversationService = service;
    
    // Middleware
    app.use(express.json());
    app.use(cors());

    // Heartbeat API endpoint
    app.get('/api/heartbeat', async (req: Request, res: Response) => {
        const requestTime = new Date();
        const message = req.query.message as string || '';
        
        try {
            const aiResponse = await conversationService.sendMessage(message);

            // Create response
            const response = {
                ping: message,
                pong: aiResponse,
                received: requestTime.toISOString(),
                responded: new Date().toISOString()
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({
                error: 'Failed to process message with OpenAI',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    return app;
};

export default app;