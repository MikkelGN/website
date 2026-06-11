import { Page, Locator } from '@playwright/test';

export class ProfilePickerPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  get profileCards(): Locator {
    return this.page.locator('[class*="profileCard"]');
  }

  profileByName(name: string): Locator {
    return this.profileCards.filter({ hasText: name });
  }

  get pinPad(): Locator {
    return this.page.locator('[class*="pad"]');
  }

  pinKey(digit: string): Locator {
    return this.page.locator('[class*="key"]', { hasText: new RegExp(`^${digit}$`) });
  }

  get errorMessage(): Locator {
    return this.page.locator('[class*="error"]');
  }

  get backButton(): Locator {
    return this.page.locator('[class*="backBtn"]');
  }

  async enterPin(pin: string) {
    for (const digit of pin) {
      await this.pinKey(digit).click();
    }
  }

  async login(name: string, pin: string) {
    await this.profileByName(name).click();
    await this.enterPin(pin);
  }
}
