import { test as base, Page } from '@playwright/test';
import { ProfilePickerPage } from '../pages/ProfilePickerPage.po';

// Seeded by migration V7 (PIN 1234); 'Demo' is reserved for wrong-PIN tests
export const SEEDED_PLAYER = 'Gæst';
export const SEEDED_PIN = '1234';

interface CustomFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();
    await picker.login(SEEDED_PLAYER, SEEDED_PIN);
    await page.waitForURL('/');

    await use(page);
  },
});

export { expect } from '@playwright/test';
