import { type Page, type Locator, expect } from "@playwright/test";

export class ProfilePage {
  private readonly page: Page;
  private readonly header1: string = "div.header.box h1";
  private readonly header4: string = "div#scroll-form h4";
  private readonly selectState: string = "#state-dd";
  private readonly zipCode: string = 'input[type="tel"][name="zip"]';
  private readonly county: string = "span.county-name";
  private readonly incomeTypeDollars: string = "#dollars";
  private readonly incomeTypePercent: string = "#percent";
  private readonly income: string = "#yearly-income";
  private readonly spouseCoverageAvailable: string =
    'input[name="employer-coverage"][value="1"]';
  private readonly spouseCoverageNotAvailable: string =
    'input[name="employer-coverage"][value="0"]';
  private readonly numberOfPeopleInFamily: string =
    'select[id="number-people"]';
  private readonly numberOfAdults: string = "#number-adults";
  private readonly numberOfChildren: string = "#number-children";
  private readonly submitButton: string = `input[type="submit"][value="Submit"]`;

  // Constructor to initialize the page object
  constructor(page: Page) {
    this.page = page;
  }

  // Dynamic selectors
  private readonly ageOfAdult = (index: number) =>
    `select[name="adults[${index}][age]"]`;
  private readonly isAdultUsesTobacco = (index: number) =>
    `select[id="adults[${index}][tobacco]-1"]`;

  private readonly ageOfChild = (index: number) =>
    `select[name="children[${index}][age]"]`;
  private readonly isChildUsesTobacco = (index: number) =>
    `select[id="children[${index}][tobacco]-1"]`;

  async goto() {
    await this.page.goto("https://www.kff.org/interactive/subsidy-calculator/");
  }

  async getHeader1() {
    return this.page.locator(this.header1).textContent();
  }

  async fillAdultAge(values: number[]) {
    for (let i = 0; i < values.length; i++) {
      await this.page.locator(this.ageOfAdult(i)).fill(values[i].toString());
    }
  }

  async fillChildrenAge(values: number[]) {
    for (let i = 0; i < values.length; i++) {
      await this.page.locator(this.ageOfChild(i)).fill(values[i].toString());
    }
  }

  async submitForm() {
    await this.page.locator(this.submitButton).click();
  }
}
