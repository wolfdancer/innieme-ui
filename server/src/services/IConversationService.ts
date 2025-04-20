export interface IConversationService {
    sendMessage(message: string): Promise<string>;
}