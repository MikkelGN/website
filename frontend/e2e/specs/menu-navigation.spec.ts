import { test, expect, SEEDED_PLAYER, SEEDED_PIN } from '../fixtures/customFixtures';
import { ProfilePickerPage } from '../pages/ProfilePickerPage.po';
import { HomePage } from '../pages/HomePage.po';

test.describe('Login and navigation', () => {
  test('login page shows the profile picker', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();

    await expect(picker.profileCards.first()).toBeVisible();
  });

  test('logging in with profile and PIN shows the home hub', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    const homePage = new HomePage(page);
    await picker.goto();

    await picker.login(SEEDED_PLAYER, SEEDED_PIN);

    await expect(page).toHaveURL('/');
    await expect(homePage.nav).toBeVisible();
  });

  test('navigating to the leaderboard from the nav bar', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await homePage.goToLeaderboard();

    await expect(page).toHaveURL(/\/leaderboard/);
  });

  test('logging out returns to the login page', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await homePage.logout();

    await expect(page).toHaveURL(/\/login/);
  });
});
