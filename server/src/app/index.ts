import express, { Request, Response } from 'express';
import cors from 'cors';
import { loadConfig } from '../config/config';
import { OpenAIConversationService } from '../services/OpenAIConversationService';
import { IConversationService } from '../services/IConversationService';

// Initialize express app
const app = express();

// Initialize Conversation Service
const config = loadConfig();
let conversationService: IConversationService = new OpenAIConversationService(config.openai_api_key);

export const setConversationService = (service: IConversationService) => {
    conversationService = service;
};

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

export default app;