import { test, expect } from '@playwright/test';
import { HeartbeatPage} from '../test-utils/heartbeat-page';

test.describe('E2E Tests', () => {

  test('heartbeat page loads and responds', async ({ page }) => {
    const heartbeatPage = new HeartbeatPage(page);
    
    // Navigate to heartbeat page
    await heartbeatPage.goto();

    // Verify page loaded
    await expect(page).toHaveTitle('InnieMe');
    
// Check heartbeat response
    // Check heartbeat response
    const response = await heartbeatPage.getHeartbeatStatus("hello");
    expect(response.ping).toBe("hello");
    expect(response.pong).toContain('Hello');
    
    // Verify datetime strings
    expect(typeof response.received).toBe('string');
    expect(Date.parse(response.received)).not.toBeNaN();
    expect(typeof response.responded).toBe('string'); 
    expect(Date.parse(response.responded)).not.toBeNaN();
  });

  test('heartbeat page can carry on a conversation', async ({ page }) => {
    const firstMessage = "which is your LLM model?";
    const heartbeatPage = new HeartbeatPage(page);
    await heartbeatPage.goto();
    await heartbeatPage.enterMessage(firstMessage);
    const history = await heartbeatPage.getChatHistory();

    expect(history).toHaveLength(2);
    
    const userMessage = history[0];
    expect(userMessage.label).toBe('You:');
    expect(userMessage.timestamp).not.toBeNaN();
    expect(userMessage.content).toBe(firstMessage);

    const botResponse = history[1];
    expect(botResponse.label).toBe('Bot:');
    expect(botResponse.timestamp).not.toBeNaN();
    expect(botResponse.content).toContain('OpenAI');
  });
})