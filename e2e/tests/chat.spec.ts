import { test, expect } from '@playwright/test';
import { HeartbeatPage} from '../test-utils/heartbeat-page';

test.describe('E2E Tests', () => {

  test('heartbeat page loads and responds', async ({ page }) => {
    const heartbeatPage = new HeartbeatPage(page);
    
    // Navigate to heartbeat page
    await heartbeatPage.goto();

    // Verify page loaded
    await expect(page).toHaveTitle('InnieMe');
  });

  test('heartbeat page can carry on a conversation', async ({ page }) => {
    const firstMessage = "Who are you?";
    const heartbeatPage = new HeartbeatPage(page);
    await heartbeatPage.goto();
    const history = await heartbeatPage.chat(firstMessage);

    expect(history).toHaveLength(2);
    
    expect(history[0]).toEqual({
        label: 'You:',
        content: firstMessage,
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });

    expect(history[1]).toEqual({
        label: 'InnieMe:',
        content: expect.stringMatching(/innieme/i),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });
    
    const secondQuestion = 'What was my original question?';
    const newHistory = await heartbeatPage.chat(secondQuestion);
    expect(newHistory).toHaveLength(4);

    expect(newHistory[0]).toEqual({
      label: 'You:',
      content: firstMessage,
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });

    expect(newHistory[1]).toEqual({
      label: 'InnieMe:',
      content: expect.stringMatching(/innieme/i),
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });

    expect(newHistory[2]).toEqual({
      label: 'You:',
      content: secondQuestion,
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });

    expect(newHistory[3]).toEqual({
      label: 'InnieMe:',
      content: expect.stringContaining("original question"),
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    });

    expect(newHistory[3].content).toContain(firstMessage);
  });
})