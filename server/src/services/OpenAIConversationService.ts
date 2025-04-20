import OpenAI from 'openai';
import { IConversationService } from './IConversationService';

export class OpenAIConversationService implements IConversationService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            apiKey: apiKey
        });
    }

    async sendMessage(message: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || '';
    }
}