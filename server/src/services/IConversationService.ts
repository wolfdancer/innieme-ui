export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface IConversationService {
    sendMessage(message: string, history?: ChatMessage[]): Promise<string>;
}