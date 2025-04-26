import { ChatMessage, IConversationService } from './IConversationService';

export class EchoConversationService implements IConversationService {
    private checkForError(message: string): void {
        if (message === "trigger-error") {
            throw new Error("Triggered error as requested");
        }
    }

    async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
        this.checkForError(message);
        
        const response = [message.split('').reverse().join('')];
        for (const msg of history.reverse()) {
            response.push(msg.content.split('').reverse().join(''));
        }
        return response.join('\n');
    }
}