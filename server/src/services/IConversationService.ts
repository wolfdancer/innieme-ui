import { init } from "openai/_shims";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface IConversationService {
    initialize(): Promise<void>;
    sendMessage(message: string, history?: ChatMessage[], topic?: string): Promise<string>;
}