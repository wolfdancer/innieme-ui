import OpenAI from 'openai';
import { ChatMessage, IConversationService } from './IConversationService';

export class OpenAIConversationService implements IConversationService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            apiKey: apiKey
        });
    }

    async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: 'You are a helpful assistant.' }
        ]
        for (const message of history) {
            messages.push({
                role: message.role,
                content: message.content
            });
        }
        messages.push({
            role: 'user',
            content: message
        });

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        });

        return completion.choices[0]?.message?.content ?? 'No response generated';
    }
}