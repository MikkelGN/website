import { test, expect } from '../fixtures/customFixtures';
import { WordBlitzPage } from '../pages/WordBlitzPage.po';

test.describe('Word Blitz', () => {
  test('category selection requires at least two categories', async ({ authenticatedPage: page }) => {
    const game = new WordBlitzPage(page);
    await game.goto();

    await expect(game.categoryChips.first()).toBeVisible();
    await expect(game.startButton).toBeDisabled();

    await game.selectCategories(1);
    await expect(game.startButton).toBeDisabled();

    await game.categoryChips.nth(1).click();
    await expect(game.startButton).toBeEnabled();
  });

  test('starting a game shows the word, timer and answer buttons', async ({ authenticatedPage: page }) => {
    const game = new WordBlitzPage(page);
    await game.goto();

    await game.selectCategories(2);
    await game.startButton.click();

    await expect(game.wordCard).toBeVisible();
    await expect(game.timerBar).toBeVisible();
    await expect(game.answerButtons).toHaveCount(2);
  });

  test('playing through to game over shows the result card', async ({ authenticatedPage: page }) => {
    const game = new WordBlitzPage(page);
    await game.goto();

    await game.selectCategories(2);
    await game.startButton.click();
    await expect(game.wordCard).toBeVisible();

    await game.playUntilGameOver();

    await expect(game.gameOverCard).toBeVisible();
    await expect(game.playAgainButton).toBeVisible();
  });

  test('play again restarts at category selection or a new round', async ({ authenticatedPage: page }) => {
    const game = new WordBlitzPage(page);
    await game.goto();

    await game.selectCategories(2);
    await game.startButton.click();
    await game.playUntilGameOver();
    await game.playAgainButton.click();

    await expect(game.wordCard.or(game.categoryChips.first())).toBeVisible();
  });
});
