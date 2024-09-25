import { Page } from "@playwright/test";

export class ProfilePage {
  private page: Page;

  // Constructor to initialize the page object
  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the profile page
  async goto() {
    await this.page.goto("https://www.kff.org/interactive/subsidy-calculator/");
  }
}
