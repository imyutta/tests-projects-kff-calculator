import { Page, expect } from "@playwright/test";

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

  // Check if the page loaded correctly
  async pageload() {
    this.goto();
    await expect(
      this.getByRole("heading", { name: "Health Insurance Marketplace" })
    ).toBeVisible();
    await expect(this.getByPlaceholder("Yearly income")).toBeVisible();
    await expect(this.getByRole("button", { name: "Submit" })).toBeVisible();
  }
}
