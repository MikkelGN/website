import { Page, Locator } from '@playwright/test';

export class MathBlitzPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/play/math-blitz');
  }

  get difficultyCards(): Locator {
    return this.page.locator('[class*="difficultyCard"]');
  }

  difficultyByName(name: RegExp): Locator {
    return this.difficultyCards.filter({ hasText: name });
  }

  get problemCard(): Locator {
    return this.page.locator('[class*="problemCard"]');
  }

  get problemText(): Locator {
    return this.page.locator('[class*="problem"]').last();
  }

  get choiceButtons(): Locator {
    return this.page.locator('[class*="choiceBtn"]');
  }

  get timerBar(): Locator {
    return this.page.locator('[class*="bar"]').first();
  }

  get gameOverCard(): Locator {
    return this.page.locator('[class*="card"]', { hasText: /flot klaret|well played/i });
  }

  get playAgainButton(): Locator {
    return this.page.locator('button', { hasText: /spil igen|play again/i });
  }

  /** Read the current problem and click the correct answer. */
  async answerCorrectly() {
    await this.page.waitForTimeout(250);
    const text = await this.problemCard.locator('h1').innerText();
    const m = text.match(/(\d+)\s*([+−×÷])\s*(\d+)/);
    if (!m) throw new Error(`Could not parse problem: ${text}`);
    const a = parseInt(m[1], 10);
    const b = parseInt(m[3], 10);
    const answer =
      m[2] === '+' ? a + b :
      m[2] === '−' ? a - b :
      m[2] === '×' ? a * b : a / b;
    await this.choiceButtons.filter({ hasText: new RegExp(`^${answer}$`) }).click();
  }

  /** Click a wrong answer to end the game. */
  async answerWrong() {
    await this.page.waitForTimeout(250);
    const text = await this.problemCard.locator('h1').innerText();
    const m = text.match(/(\d+)\s*([+−×÷])\s*(\d+)/);
    if (!m) throw new Error(`Could not parse problem: ${text}`);
    const a = parseInt(m[1], 10);
    const b = parseInt(m[3], 10);
    const answer =
      m[2] === '+' ? a + b :
      m[2] === '−' ? a - b :
      m[2] === '×' ? a * b : a / b;
    const buttons = this.choiceButtons;
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const value = parseInt(await buttons.nth(i).innerText(), 10);
      if (value !== answer) {
        await buttons.nth(i).click();
        return;
      }
    }
    throw new Error('No wrong choice found');
  }
}
