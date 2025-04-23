import { test, expect } from '@playwright/test';
import { HeartbeatPage } from '../test-utils/heartbeat-page';

test.describe('E2E Tests', () => {

  test('heartbeat page loads and responds', async ({ page }) => {
    const heartbeatPage = new HeartbeatPage(page);
    
    // Navigate to heartbeat page
    await heartbeatPage.goto();

    // Verify page loaded
    await expect(page).toHaveTitle('InnieMe');
    
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
});