import { type Page, type Locator, expect } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;

  readonly header1!: Locator;
  readonly header4!: Locator;
  readonly selectState!: Locator;
  readonly zipCode!: Locator;
  readonly county!: Locator;
  readonly incomeTypeDollars!: Locator;
  readonly incomeTypePercent!: Locator;
  readonly income!: Locator;
  readonly spouseCoverageAvailable!: Locator;
  readonly spouseCoverageNotAvailable!: Locator;
  readonly numberOfPeopleInFamily!: Locator;
  readonly numberOfAdults!: Locator;
  readonly numberOfChildren!: Locator;
  readonly submitButton!: Locator;
  readonly errorMessage!: Locator;

  // Constructor to initialize the page object
  constructor(page: Page) {
    this.page = page;
    this.header1 = this.page.locator("div.header.box h1");
    this.header4 = this.page.locator("div#scroll-form h4");
    this.selectState = this.page.locator("#state-dd");
    this.zipCode = this.page.locator('input[type="tel"][name="zip"]');
    this.county = this.page.locator("span.county-name");
    this.incomeTypeDollars = this.page.locator("#dollars");
    this.incomeTypePercent = this.page.locator("#percent");
    this.income = this.page.locator("#yearly-income");
    this.spouseCoverageAvailable = this.page.locator(
      'input[name="employer-coverage"][value="1"]'
    );
    this.spouseCoverageNotAvailable = this.page.locator(
      'input[name="employer-coverage"][value="0"]'
    );
    this.numberOfPeopleInFamily = this.page.locator(
      'select[id="number-people"]'
    );
    this.numberOfAdults = this.page.locator("#number-adults");
    this.numberOfChildren = this.page.locator("#number-children");
    this.submitButton = this.page.locator(
      'input[type="submit"][value="Submit"]'
    );
    this.errorMessage = this.page.locator("form-message");
  }

  // Dynamic selectors
  getAgeOfAdultSelector = (index: number) =>
    `select[name="adults[${index}][age]"]`;
  getIsAdultUsesTobaccoSelector = (index: number) =>
    `select[id="adults[${index}][tobacco]-1"]`;

  getAgeOfChildSelector = (index: number) =>
    `select[name="children[${index}][age]"]`;
  getIsChildUsesTobaccoSelector = (index: number) =>
    `select[id="children[${index}][tobacco]-1"]`;

  async goto() {
    await this.page.goto("https://www.kff.org/interactive/subsidy-calculator/");
    await this.page.waitForTimeout(2000);
  }

  async setStateAndZipCode(state: string, zipCode: string) {
    await this.selectState.selectOption(state);
    await this.zipCode.fill(zipCode);
  }

  async verifyStateAndCounty(expectedState: string, expectedCounty?: string) {
    await expect(this.selectState).toHaveValue(expectedState);
    if (expectedCounty) {
      await expect(this.county).toBeVisible();
      await expect(this.county).toContainText(expectedCounty);
    } else {
      await expect(this.county).not.toBeVisible();
    }
  }

  async emitInputChangeEvent(locator: Locator) {
    locator.dispatchEvent("change");
    locator.dispatchEvent("input");
  }

  async fillAdultAge(values: number[]) {
    for (let i = 0; i < values.length; i++) {
      await this.page
        .locator(this.getAgeOfAdultSelector(i))
        .fill(values[i].toString());
    }
  }

  async fillChildrenAge(values: number[]) {
    for (let i = 0; i < values.length; i++) {
      await this.page
        .locator(this.getAgeOfChildSelector(i))
        .fill(values[i].toString());
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
