import express, { Request, Response } from 'express';
import cors from 'cors';

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Heartbeat API endpoint
app.get('/api/heartbeat', (req: Request, res: Response) => {
    const requestTime = new Date();
    const message = req.query.message as string || '';
    const reversedMessage = message.split('').reverse().join('');

    // Create response
    const response = {
        ping: message,
        pong: reversedMessage,
        received: requestTime.toISOString(),
        responded: new Date().toISOString()
    };

    res.json(response);
});

export default app;