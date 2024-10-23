import test from "../test-setup";
import { expect, Locator } from "@playwright/test";
import { ProfilePage } from "../page-models/profile-page";

test.describe("KFF-Calculator", () => {
  let profilePage: ProfilePage;
  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.goto();
  });

  test.describe("Smoke tests", () => {
    test("SMK-TC001: Page loads correctly", async () => {
      await expect(profilePage.header1).toContainText(
        "Health Insurance Marketplace Calculator"
      );
      await expect(profilePage.header4).toContainText(
        "Enter Information About Your Household"
      );

      await expect(profilePage.header1).toBeVisible();
      await expect(profilePage.header4).toBeVisible();
      await expect(profilePage.selectState).toBeVisible();
      await expect(profilePage.incomeTypeDollars).toBeVisible();
      await expect(profilePage.incomeTypePercent).toBeVisible();
      await expect(profilePage.income).toBeVisible();
      await expect(profilePage.spouseCoverageAvailable).toBeVisible();
      await expect(profilePage.spouseCoverageNotAvailable).toBeVisible();
      await expect(profilePage.numberOfPeopleInFamily).toBeVisible();
      await expect(profilePage.numberOfAdults).toBeVisible();
      await expect(profilePage.numberOfChildren).toBeVisible();
      await expect(profilePage.submitButton).toBeVisible();
    });
  });

  test.describe("1. Functional tests", () => {
    test.describe("1.1. State, Zip Code and County mapping", () => {
      test("FUNC-ZIP-MAPPING-TC001: Displays correct county for valid California Zip Code", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");
      });
      test("FUNC-ZIP-MAPPING-TC002: County updates correctly with new Zip Code from the same state)", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");
        await profilePage.zipCode.fill("92070");
        await profilePage.verifyStateAndCounty("ca", "SAN DIEGO");
      });

      test("FUNC-ZIP-MAPPING-TC003: Zip code cleared and county hidden after changing the state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");

        await profilePage.selectState.selectOption("Utah");
        await expect(profilePage.zipCode).toBeEmpty;
        await expect(profilePage.county).not.toBeVisible();
      });
      test("FUNC-ZIP-MAPPING-TC004: State updated and county hidden after setting a zip code from a different state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");

        await profilePage.zipCode.fill("84080");
        await profilePage.emitInputChangeEvent(profilePage.zipCode);
        await profilePage.verifyStateAndCounty("ut");
      });
      test("FUNC-ZIP-MAPPING-TC005: Zip Code cleared and county hidden after selecting 'US Average' state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");

        await profilePage.selectState.selectOption("US Average");
        await expect(profilePage.zipCode).not.toBeVisible();
        await expect(profilePage.county).not.toBeVisible();
      });
    });
    test.describe("1.2. Zip Code Field. Validation tests ", () => {
      test.describe("1.2.1. Boundary-value analysis tests", () => {
        test("FUNC-ZIP-BT001: Should accept input with 5 digits", async () => {
          // TODO
        });
        test("FUNC-ZIP-BT002: Should not accept input with less than 5 digits", async () => {
          // TODO
        });
        test("FUNC-ZIP-BT003: Should ignore input after 5 digits", async () => {
          // TODO
        });
      });
      test.describe("1.2.2. Negative tests", () => {
        test("FUNC-ZIP-NT001: Displays an error message when Zip Code input is empty", async () => {
          // TODO
        });
        test("FUNC-ZIP-NT002: Disallow letters/symbols in Zip Code field", async () => {
          // TODO
        });
        test("FUNC-ZIP-NT003: Disallow negative numbers in Zip Code input", async () => {
          // TODO
        });
        test("FUNC-ZIP-NT004: Correct State and Region Display for 4-Digit Zip Code", async () => {
          // TODO
        });
        test("FUNC-ZIP-NT005: Error Message Display for Non-Existent Zip Code Input", async () => {
          // TODO
        });
      });
    });
  });
});
