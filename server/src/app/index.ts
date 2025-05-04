import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { IConversationService, ChatMessage } from '../services/IConversationService';
import { RateLimitRequestHandler } from 'express-rate-limit';

interface ChatRequest {
    topic?: string;
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

export const initializeApp = (
    service: IConversationService,
    limiter?: RateLimitRequestHandler) => {
    let conversationService = service;
    let isInitialized = false;
    
    // Retry configuration
    const maxRetries = 5;
    const baseDelay = 1000; // Start with 1 second delay
    
    const initializeWithRetry = (attempt = 0) => {
      service.initialize()
        .then(() => {
          console.log('Conversation service initialized successfully');
          isInitialized = true;
        })
        .catch(err => {
          console.error(`Failed to initialize conversation service (attempt ${attempt + 1}/${maxRetries}):`, err);
          
          if (attempt < maxRetries - 1) {
            // Calculate delay with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Retrying in ${delay/1000} seconds...`);
            
            setTimeout(() => {
              initializeWithRetry(attempt + 1);
            }, delay);
          } else {
            console.error('Maximum retry attempts reached. Service initialization failed.');
            // Optionally, you could implement a fallback mechanism here
            // or set a flag to indicate permanent failure
          }
        });
    };
    
    // Start initialization process with retry logic
    initializeWithRetry();
    
    // Middleware
    app.use(express.json());
    app.use(cors());

    // Apply rate limiting middleware if provided
    if (limiter) {
        app.use(limiter);
    }
    
    // Add service ready check middleware
    app.use(((req: Request, res: Response, next: NextFunction): void => {
        if (!isInitialized) {
            res.status(503).json({
                error: 'Service Unavailable',
                details: 'The conversation service is still initializing. Please try again shortly.'
            });
            return
        }
        next();
    }));

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

            const aiResponse = await conversationService.sendMessage(
                requestBody.message,
                requestBody.history,
                requestBody.topic
            );
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