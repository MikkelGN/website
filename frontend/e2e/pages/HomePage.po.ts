import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  get nav(): Locator {
    return this.page.locator('nav');
  }

  get wordBlitzCard(): Locator {
    return this.page.locator('[class*="wordCard"]');
  }

  get snakeCard(): Locator {
    return this.page.locator('[class*="snakeCard"]');
  }

  get tetrisCard(): Locator {
    return this.page.locator('[class*="tetrisCard"]');
  }

  get mathCard(): Locator {
    return this.page.locator('[class*="mathCard"]');
  }

  get categoryTitles(): Locator {
    return this.page.locator('[class*="categoryTitle"]');
  }

  get langToggle(): Locator {
    return this.page.locator('nav [class*="toggle"]');
  }

  get leaderboardButton(): Locator {
    return this.page.locator('[class*="leaderboardBtn"]');
  }

  get logoutButton(): Locator {
    return this.page.locator('[class*="logoutBtn"]');
  }

  async goToWordBlitz() {
    await this.wordBlitzCard.click();
  }

  async goToSnake() {
    await this.snakeCard.click();
  }

  async goToTetris() {
    await this.tetrisCard.click();
  }

  async goToLeaderboard() {
    await this.leaderboardButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
