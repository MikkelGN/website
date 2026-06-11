import { test, expect } from '../fixtures/customFixtures';
import { HomePage } from '../pages/HomePage.po';

test.describe('Home hub', () => {
  test('shows the three game categories', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.categoryTitles).toHaveCount(3);
    await expect(homePage.categoryTitles.nth(0)).toHaveText(/sprog|language/i);
    await expect(homePage.categoryTitles.nth(1)).toHaveText(/matematik|math/i);
    await expect(homePage.categoryTitles.nth(2)).toHaveText(/arkade|arcade/i);
  });

  test('math tile navigates to Math Blitz', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.mathCard).toBeVisible();
    await homePage.mathCard.click();

    await expect(page).toHaveURL(/\/play\/math-blitz/);
  });

  test('language toggle switches the hub copy', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.categoryTitles.nth(2)).toHaveText('Arkade');
    await homePage.langToggle.click();
    await expect(homePage.categoryTitles.nth(2)).toHaveText('Arcade');
    await homePage.langToggle.click();
    await expect(homePage.categoryTitles.nth(2)).toHaveText('Arkade');
  });

  test('legacy game routes redirect to /play/*', async ({ authenticatedPage: page }) => {
    await page.goto('/game');
    await expect(page).toHaveURL(/\/play\/word-blitz/);

    await page.goto('/snake');
    await expect(page).toHaveURL(/\/play\/snake/);

    await page.goto('/tetris');
    await expect(page).toHaveURL(/\/play\/tetris/);
  });
});
