import { ChatMessage, IConversationService } from './IConversationService';

export class EchoConversationService implements IConversationService {
    private checkForError(message: string): void {
        if (message === "trigger-error") {
            throw new Error("Triggered error as requested");
        }
    }

    async sendMessage(message: string, history: ChatMessage[] = [], topic: string = ''): Promise<string> {
        this.checkForError(message);
        
        if (message === undefined) {
            throw new Error("Input Error: message cannot be undefined");
        }

        // Reverse the message and history for the echo effect
        const response = [message.split('').reverse().join('')];
        for (const msg of history.reverse()) {
            response.push(msg.content.split('').reverse().join(''));
        }
        return response.join('\n');
    }

    async initialize(): Promise<void> {
        // No initialization needed for EchoConversationService
    }
}