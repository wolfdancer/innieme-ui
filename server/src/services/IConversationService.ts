import { init } from "openai/_shims";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface IConversationService {
    initialize(): void;
    sendMessage(message: string, history?: ChatMessage[], topic?: string): Promise<string>;
}