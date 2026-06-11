import { test, expect } from '@playwright/test';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admindev';

test.describe('Admin panel', () => {
  test('admin can log in and see the progress tab', async ({ page }) => {
    await page.goto('/admin/login');

    await page.locator('form input').nth(0).fill(ADMIN_USER);
    await page.locator('form input').nth(1).fill(ADMIN_PASS);
    await page.locator('form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/admin/);

    await page.locator('button', { hasText: /fremskridt|progress/i }).click();
    await expect(page.locator('table th', { hasText: /spiller|player/i })).toBeVisible();
  });

  test('admin players tab lists the seeded profiles', async ({ page }) => {
    await page.goto('/admin/login');
    await page.locator('form input').nth(0).fill(ADMIN_USER);
    await page.locator('form input').nth(1).fill(ADMIN_PASS);
    await page.locator('form button[type="submit"]').click();

    await page.locator('button', { hasText: /spillere|players/i }).click();
    await expect(page.locator('table tbody tr', { hasText: 'Gæst' })).toBeVisible();
  });
});
