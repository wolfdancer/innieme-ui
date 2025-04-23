import { loadConfig } from './config/config';
import { OpenAIConversationService } from './services/OpenAIConversationService';
import { initializeApp } from './app';

const startServer = () => {
    const config = loadConfig();

    const conversationService = new OpenAIConversationService(config.openai_api_key);
    const app = initializeApp(conversationService);
    
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();