import { type Page, type Locator, expect } from "@playwright/test";
export enum IncomeType {
  DOLLARS = "dollars",
  PERCENT = "% of Poverty",
}

export type FormParams = {
  incomeType?: IncomeType;
  income?: number;
  isSpouseCoverageAvailable?: boolean;
  numberOfPeople?: number;
  numberOfAdults?: number;
  adult0Age?: number;
  doesAdult0UseTobacco?: boolean;
  numberOfChildren?: number;
  child0Age?: number;
  doesChild0UseTobacco?: boolean;
};

export class ProfilePage {
  readonly page: Page;

  readonly header1!: Locator;
  readonly header4!: Locator;
  readonly selectState!: Locator;
  readonly zipCode!: Locator;
  readonly county!: Locator;
  readonly incomeTypeDollars!: Locator;
  readonly incomeTypePercentOfPoverty!: Locator;
  readonly income!: Locator;
  readonly spouseCoverageAvailable!: Locator;
  readonly spouseCoverageNotAvailable!: Locator;
  readonly numberOfPeopleInFamily!: Locator;
  readonly numberOfAdults!: Locator;
  readonly numberOfChildren!: Locator;
  readonly submitButton!: Locator;
  readonly errorMessage!: Locator;
  readonly header2!: Locator;

  // Constructor to initialize the page object
  constructor(page: Page) {
    this.page = page;
    this.header1 = this.page.locator("div.header.box h1");
    this.header4 = this.page.locator("div#scroll-form h4");
    this.selectState = this.page.locator("#state-dd");
    this.zipCode = this.page.locator('input[type="tel"][name="zip"]');
    this.county = this.page.locator("span.county-name");
    this.incomeTypeDollars = this.page.locator("#dollars");
    this.incomeTypePercentOfPoverty = this.page.locator("#percent");
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
    this.errorMessage = this.page.locator("p.form-message");
    this.header2 = this.page.locator("div.subsidy-results-wrapper h2");
  }

  // Dynamic selectors
  getAgeOfAdultSelector = (index: number) =>
    `select[name="adults[${index}][age]"]`;
  getIsAdultUsesTobaccoSelectorYes = (index: number) =>
    `input[id="adults[${index}][tobacco]-1"]`;
  getIsAdultUsesTobaccoSelectorNo = (index: number) =>
    `input[id="adults[${index}][tobacco]-0"]`;

  getAgeOfChildSelector = (index: number) =>
    `select[name="children[${index}][age]"]`;
  getIsChildUsesTobaccoSelectorYes = (index: number) =>
    `input[id="children[${index}][tobacco]-1"]`;
  getIsChildUsesTobaccoSelectorNo = (index: number) =>
    `input[id="children[${index}][tobacco]-0"]`;

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

  async setIncomeType(incomeType: IncomeType): Promise<void> {
    switch (incomeType) {
      case IncomeType.DOLLARS:
        await this.incomeTypeDollars.check();
        break;
      case IncomeType.PERCENT:
        await this.incomeTypePercentOfPoverty.check();
        break;
    }
  }

  async setSpouseCoverage(isSpouseCoverageAvailable: boolean): Promise<void> {
    if (isSpouseCoverageAvailable) {
      await this.spouseCoverageAvailable.check();
    } else {
      await this.spouseCoverageNotAvailable.check();
    }
  }

  async setAdultDetails(index: number, age: number, usesTobacco: boolean) {
    await this.page
      .locator(this.getAgeOfAdultSelector(index))
      .selectOption(age.toString());
    const tobaccoSelector = usesTobacco
      ? this.getIsAdultUsesTobaccoSelectorYes(index)
      : this.getIsAdultUsesTobaccoSelectorNo(index);
    await this.page.locator(tobaccoSelector).check();
  }

  async setChildDetails(index: number, age: number, usesTobacco: boolean) {
    await this.page
      .locator(this.getAgeOfChildSelector(index))
      .selectOption(age.toString());
    const tobaccoSelector = usesTobacco
      ? this.getIsChildUsesTobaccoSelectorYes(index)
      : this.getIsChildUsesTobaccoSelectorNo(index);
    await this.page.locator(tobaccoSelector).check();
  }

  async fillFormElements({
    incomeType = IncomeType.DOLLARS,
    income = 100000,
    isSpouseCoverageAvailable = true,
    numberOfPeople = 2,
    numberOfAdults = 1,
    adult0Age = 21,
    doesAdult0UseTobacco = false,
    numberOfChildren = 1,
    child0Age = 10,
    doesChild0UseTobacco = false,
  }: FormParams = {}) {
    await this.setIncomeType(incomeType);
    await this.income.fill(income.toString());
    await this.setSpouseCoverage(isSpouseCoverageAvailable);
    await this.numberOfPeopleInFamily.selectOption(numberOfPeople.toString());
    await this.numberOfAdults.selectOption(numberOfAdults.toString());
    await this.setAdultDetails(0, adult0Age, doesAdult0UseTobacco);
    await this.numberOfChildren.selectOption(numberOfChildren.toString());
    await this.setChildDetails(0, child0Age, doesChild0UseTobacco);
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
