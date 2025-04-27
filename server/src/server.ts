import { loadConfig } from './config/config';
import { OpenAIConversationService } from './services/OpenAIConversationService';
import { initializeApp } from './app';

import path from 'path';

const startServer = () => {
    const configPath = process.env.CONFIG_PATH || path.join(__dirname, '../../config.yaml');
    const config = loadConfig(configPath);

    const conversationService = new OpenAIConversationService(config);
    const app = initializeApp(conversationService);
    
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();