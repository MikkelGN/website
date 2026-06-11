import { test, expect } from '../fixtures/customFixtures';
import { HomePage } from '../pages/HomePage.po';

test.describe('Game navigation', () => {
  test('home hub shows Word Blitz, Snake and Tetris', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.wordBlitzCard).toBeVisible();
    await expect(homePage.snakeCard).toBeVisible();
    await expect(homePage.tetrisCard).toBeVisible();
  });

  test('navigating to Word Blitz', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await homePage.goToWordBlitz();

    await expect(page).toHaveURL(/\/play\/word-blitz/);
  });

  test('navigating to Snake', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await homePage.goToSnake();

    await expect(page).toHaveURL(/\/play\/snake/);
  });

  test('navigating to Tetris', async ({ authenticatedPage: page }) => {
    const homePage = new HomePage(page);

    await homePage.goToTetris();

    await expect(page).toHaveURL(/\/play\/tetris/);
  });
});
