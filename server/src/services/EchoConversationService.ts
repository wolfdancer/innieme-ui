import { IConversationService } from './IConversationService';

export class EchoConversationService implements IConversationService {
    async sendMessage(message: string): Promise<string> {
        return message.split('').reverse().join('');
    }
}