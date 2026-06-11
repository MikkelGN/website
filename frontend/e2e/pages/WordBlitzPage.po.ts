import { Page, Locator } from '@playwright/test';

export class WordBlitzPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/play/word-blitz');
  }

  get categoryChips(): Locator {
    return this.page.locator('[class*="chip"]');
  }

  get startButton(): Locator {
    return this.page.locator('button', { hasText: /start spil|start game/i });
  }

  get wordCard(): Locator {
    return this.page.locator('[class*="wordCard"]');
  }

  get timerBar(): Locator {
    return this.page.locator('[class*="bar"]').first();
  }

  get answerButtons(): Locator {
    return this.page.locator('[class*="catBtn"]');
  }

  get gameOverCard(): Locator {
    return this.page.locator('[class*="card"]', { hasText: /flot klaret|well played/i });
  }

  get playAgainButton(): Locator {
    return this.page.locator('button', { hasText: /spil igen|play again/i });
  }

  async selectCategories(count: number) {
    for (let i = 0; i < count; i++) {
      await this.categoryChips.nth(i).click();
    }
  }

  /** Click the first answer until a wrong answer ends the game. */
  async playUntilGameOver(maxRounds = 20) {
    for (let i = 0; i < maxRounds; i++) {
      if (await this.gameOverCard.isVisible()) return;
      await this.answerButtons.first().click();
      await this.page.waitForTimeout(400);
    }
  }
}
