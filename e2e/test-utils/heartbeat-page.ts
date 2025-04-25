import { Page } from '@playwright/test';

interface Chat {
  label: string;
  timestamp: string;
  content: string;
}

export class HeartbeatPage {
    constructor(private page: Page) {}
    
    async goto() {
      await this.page.goto('/');
    }
    
    async getHeartbeatStatus(query: string) {
      await this.enterMessage(query);
      const responseText = await this.page.textContent('.response-container pre');
      return responseText ? JSON.parse(responseText) : null;
    }

    async enterMessage(query: string) {
      await this.page.fill('input[type="text"]', query);
      await this.page.click('button:has-text("Send Heartbeat")');
      await this.page.waitForSelector('button:has-text("Send Heartbeat"):enabled');
    }

    async getChatHistory(): Promise<Chat[]> {
      const messages = await this.page.$$('.message-container > div');
      const history: Chat[] = [];
      
      for (const message of messages) {
        const messageJson: Partial<Chat> = {};
        
        const spans = await message.$$('span');
        
        for (const span of spans) {
          const className = await span.getAttribute('class');
          const text = await span.textContent();
          
          if (className && text) {
            switch (className) {
              case 'label':
                messageJson.label = text;
                break;
              case 'timestamp':
                messageJson.timestamp = text;
                break;
              case 'content':
                messageJson.content = text;
                break;
            }
          }
        }
        
        if (messageJson.label && messageJson.timestamp && messageJson.content) {
          history.push(messageJson as Chat);
        }
      }
      
      return history;
    }

  }

