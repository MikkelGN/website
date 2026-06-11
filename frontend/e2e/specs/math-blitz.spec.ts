import { test, expect } from '../fixtures/customFixtures';
import { MathBlitzPage } from '../pages/MathBlitzPage.po';

test.describe('Math Blitz', () => {
  test('shows three difficulty choices', async ({ authenticatedPage: page }) => {
    const game = new MathBlitzPage(page);
    await game.goto();

    await expect(game.difficultyCards).toHaveCount(3);
  });

  test('starting easy shows a problem with four choices', async ({ authenticatedPage: page }) => {
    const game = new MathBlitzPage(page);
    await game.goto();

    await game.difficultyByName(/let|easy/i).click();

    await expect(game.problemCard).toBeVisible();
    await expect(game.choiceButtons).toHaveCount(4);
    await expect(game.timerBar).toBeVisible();
  });

  test('correct answers increase the score', async ({ authenticatedPage: page }) => {
    const game = new MathBlitzPage(page);
    await game.goto();
    await game.difficultyByName(/let|easy/i).click();

    await game.answerCorrectly();
    await game.answerCorrectly();

    await expect(page.locator('[class*="hudValue"]').first()).not.toHaveText('0');
  });

  test('a wrong answer ends the game and submits the score', async ({ authenticatedPage: page }) => {
    const game = new MathBlitzPage(page);
    await game.goto();
    await game.difficultyByName(/let|easy/i).click();

    await game.answerCorrectly();
    await game.answerWrong();

    await expect(game.gameOverCard).toBeVisible();
    await expect(game.playAgainButton).toBeVisible();

    // The score shows up on the Math Blitz leaderboard
    await page.goto('/leaderboard');
    await page.locator('button', { hasText: /math blitz/i }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Gæst');
  });
});
