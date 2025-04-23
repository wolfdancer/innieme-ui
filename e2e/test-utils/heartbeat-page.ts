import { Page } from '@playwright/test';

export class HeartbeatPage {
    constructor(private page: Page) {}
    
    async goto() {
      await this.page.goto('/');
    }
    
    async getHeartbeatStatus(query: string) {
      await this.page.fill('input[type="text"]', query);
      await this.page.click('button:has-text("Send Heartbeat")');
      await this.page.waitForSelector('button:has-text("Send Heartbeat"):enabled');
      const responseText = await this.page.textContent('.response-container pre');
      return responseText ? JSON.parse(responseText) : null;
    }
}

