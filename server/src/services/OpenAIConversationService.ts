import OpenAI from 'openai';
import { Config } from '../config/config';
import { ChatMessage, IConversationService } from './IConversationService';
import { KnowledgeService } from './KnowledgeService';
import { sys } from 'typescript';
import e from 'express';

export class OpenAIConversationService implements IConversationService {
    private openai: OpenAI;
    private topics = new Map<string, KnowledgeService>();

    constructor(config: Config) {
        this.openai = new OpenAI({
            apiKey: config.openai_api_key
        });
        for (const outie of config.outies) {
            for (const topic of outie.topics) {
                const knowledgeService = new KnowledgeService(topic, config.openai_api_key);
                this.topics.set(topic.id, knowledgeService);
            }
        }
    }

    async initialize(): Promise<void> {
        await Promise.all(
            Array.from(this.topics.values()).map(knowledgeService => 
                knowledgeService.initialize()
            )
        );
    }
    
    async sendMessage(message: string, history: ChatMessage[] = [], topic: string = ''): Promise<string> {
        const matchedTopic = this.topics.get(topic) ?? this.topics.get("default");
        let systemPrompt = '';
        if (matchedTopic) {
            console.log(`Using topic: ${matchedTopic.name}`);
            const match = await matchedTopic.similaritySearch(message);
            systemPrompt = match?.length 
                ? `${matchedTopic.role}

Here is some relevant information to help answer the query:

${match.join('\n\n')}`
                : `${matchedTopic.role}

no match found in the knowledge base`;
        }
        else {
            console.log(`No topic found for: ${topic}`);
        }
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt }
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
            temperature: 0.1,
            max_tokens: 1000
        });

        return completion.choices[0]?.message?.content ?? 'No response generated';
    }
}