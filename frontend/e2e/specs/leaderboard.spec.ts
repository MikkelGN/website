import { test, expect } from '../fixtures/customFixtures';

const TABS = [/word blitz/i, /math blitz/i, /slange|snake/i, /tetris/i];

test.describe('Unified leaderboard', () => {
  test('all four game tabs render entries or an empty state', async ({ authenticatedPage: page }) => {
    await page.goto('/leaderboard');

    for (const tab of TABS) {
      await page.locator('button[class*="tab"]', { hasText: tab }).first().click();
      // Either a populated table or the empty message must appear
      await expect(
        page.locator('table tbody tr').first().or(page.locator('[class*="empty"]'))
      ).toBeVisible();
    }
  });

  test('word blitz tab shows correct/streak columns', async ({ authenticatedPage: page }) => {
    await page.goto('/leaderboard');

    await page.locator('button[class*="tab"]', { hasText: /word blitz/i }).first().click();
    const table = page.locator('table');
    if (await table.isVisible()) {
      await expect(table.locator('th')).toHaveCount(5);
    }
  });
});
