import { test, expect, SEEDED_PIN } from '../fixtures/customFixtures';
import { ProfilePickerPage } from '../pages/ProfilePickerPage.po';

test.describe('Profile picker login', () => {
  test('shows the seeded profiles', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();

    await expect(picker.profileByName('Gæst')).toBeVisible();
    await expect(picker.profileByName('Demo')).toBeVisible();
  });

  test('picking a profile shows the PIN pad', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();

    await picker.profileByName('Gæst').click();

    await expect(picker.pinPad).toBeVisible();
    await expect(picker.pinKey('5')).toBeVisible();
  });

  test('correct PIN logs in and reaches the hub', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();

    await picker.login('Gæst', SEEDED_PIN);

    await expect(page).toHaveURL('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('wrong PIN shows an error and stays on the picker', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();

    await picker.login('Demo', '9999');

    await expect(picker.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('back button returns to the profile grid', async ({ page }) => {
    const picker = new ProfilePickerPage(page);
    await picker.goto();

    await picker.profileByName('Gæst').click();
    await picker.backButton.click();

    await expect(picker.profileByName('Demo')).toBeVisible();
  });
});
