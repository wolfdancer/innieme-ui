import express, { Request, Response } from 'express';
import cors from 'cors';
import { IConversationService, ChatMessage } from '../services/IConversationService';

interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}

interface ChatResponse {
    ping: string;
    pong: string;
    received: string;
    responded: string;
}

// Initialize express app
const app = express();

export const initializeApp = (service: IConversationService) => {
    let conversationService = service;
    
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
            const response: ChatResponse = {
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

    app.post('/api/chat', async (req: Request<{}, any, ChatRequest>, res: Response) => {
        const requestTime = new Date();
        const requestBody = req.body as ChatRequest;

        try {

            const aiResponse = await conversationService.sendMessage(requestBody.message, requestBody.history);
            const response: ChatResponse = {
                ping: requestBody.message,
                pong: aiResponse,
                received: requestTime.toISOString(),
                responded: new Date().toISOString()
            };
            res.json(response);
        } catch (error) {
            // Log the error for debugging
            console.error('Chat API Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                body: requestBody
            });

            // Determine status code based on error type
            let statusCode = 500;
            if (error instanceof Error) {
                // Add specific error type checks here
                if (error.message.includes('validation') || error.message.includes('invalid')) {
                    statusCode = 400;
                }
                // Add more conditions as needed
            }
            
            res.status(statusCode).json({
                error: 'Failed to process message with conversation service',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    })
    return app;
};