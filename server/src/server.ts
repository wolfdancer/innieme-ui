import { loadConfig } from './config/config';
import { OpenAIConversationService } from './services/OpenAIConversationService';
import { initializeApp } from './app';
import rateLimit from 'express-rate-limit';
import path from 'path';

const startServer = () => {
    const configPath = process.env.CONFIG_PATH || path.join(__dirname, '../../config.yaml');
    console.log('Environment CONFIG_PATH:', process.env.CONFIG_PATH);
    console.log('Loading config from:', configPath);
    console.log('__dirname is:', __dirname);
    
    const config = loadConfig(configPath);

    // Configure rate limiter
    const limiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 20, // limit each IP to 20 requests per windowMs
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests, please try again later'
    });

    const conversationService = new OpenAIConversationService(config);
    // Pass the limiter to initializeApp instead of applying it after
    const app = initializeApp(conversationService, limiter);
    
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();