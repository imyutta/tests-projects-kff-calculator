import test from "../test-setup";
import { expect, Locator } from "@playwright/test";
import { ProfilePage, IncomeType } from "../page-models/profile-page";

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
      await expect(profilePage.incomeTypePercentOfPoverty).toBeVisible();
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
        await profilePage.verifyStateZipCounty({
          expectedState: "ca",
          expectedCounty: "LOS ANGELES",
        });
      });
      test("FUNC-ZIP-MAPPING-TC002: County updates correctly with new Zip Code from the same state)", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateZipCounty({
          expectedState: "ca",
          expectedCounty: "LOS ANGELES",
        });
        await profilePage.zipCode.fill("92070");
        await profilePage.verifyStateZipCounty({
          expectedState: "ca",
          expectedCounty: "SAN DIEGO",
        });
      });

      test("FUNC-ZIP-MAPPING-TC003: Zip code cleared and county hidden after changing the state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateZipCounty({
          expectedState: "ca",
          expectedCounty: "LOS ANGELES",
        });

        await profilePage.selectState.selectOption("Utah");
        await expect(profilePage.zipCode).toBeEmpty;
        await expect(profilePage.county).not.toBeVisible();
      });
      test("FUNC-ZIP-MAPPING-TC004: State updated and county hidden after setting a zip code from a different state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateZipCounty({
          expectedState: "ca",
          expectedCounty: "LOS ANGELES",
        });

        await profilePage.zipCode.fill("84080");
        await profilePage.emitInputChangeEvent(profilePage.zipCode);
        await profilePage.verifyStateZipCounty({ expectedState: "ut" });
      });
      test("FUNC-ZIP-MAPPING-TC005: Zip Code cleared and county hidden after selecting 'US Average' state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateZipCounty({
          expectedState: "ca",
          expectedCounty: "LOS ANGELES",
        });

        await profilePage.selectState.selectOption("US Average");
        await expect(profilePage.zipCode).not.toBeVisible();
        await expect(profilePage.county).not.toBeVisible();
      });
    });
    test.describe("1.2. Zip Code Field. Validation tests ", () => {
      test.describe("1.2.1. Boundary-value analysis tests", () => {
        test("FUNC-ZIP-BT001: Should accept input with 5 digits", async () => {
          // TODO
          await profilePage.setStateAndZipCode("California", "95051");
          await profilePage.verifyStateZipCounty({
            expectedState: "ca",
            expectedCounty: "SANTA CLARA",
          });
        });
        test("FUNC-ZIP-BT002: Should not accept input with less than 5 digits", async () => {
          await profilePage.setStateAndZipCode("California", "5077");
          await profilePage.fillFormElements({});

          await profilePage.submitForm();
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "Please enter a zip code."
          );
        });
        test("FUNC-ZIP-BT003: Should ignore input after 5 digits", async () => {
          await profilePage.setStateAndZipCode("California", "950511");
          await profilePage.verifyStateZipCounty({
            expectedState: "ca",
            expectedCounty: "SANTA CLARA",
            expectedZip: "95051",
          });
        });
      });
      test.describe("1.2.2. Incorrect input", () => {
        test("FUNC-ZIP-NT001: Displays an error message when State is set but Zip Code input is empty", async () => {
          await profilePage.selectState.selectOption("California");
          await profilePage.fillFormElements({});
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "Please enter a zip code."
          );
        });
        test("FUNC-ZIP-NT002: Disallow letters/symbols in Zip Code field", async () => {
          await profilePage.setStateAndZipCode("California", "Abc");
          await profilePage.verifyStateZipCounty({
            expectedState: "ca",
            expectedZip: "",
          });
        });
        test("FUNC-ZIP-NT003: Disallow negative numbers in Zip Code input", async () => {
          await profilePage.setStateAndZipCode("California", "-123");
          await profilePage.verifyStateZipCounty({
            expectedState: "ca",
            expectedZip: "",
          });
        });
        test("FUNC-ZIP-NT004: Error Message Display for for 4-Digit Zip Code", async () => {
          await profilePage.setStateAndZipCode("California", "5077");
          await profilePage.fillFormElements({});
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "Please enter a zip code."
          );
        });
        test("FUNC-ZIP-NT005: Correct County Display for for 4-Digit Zip Code with a leading Zero", async () => {
          await profilePage.setStateAndZipCode("California", "05077");
          await profilePage.fillFormElements({
            numberOfAdults: null,
            numberOfChildren: null,
          });
          await profilePage.submitForm();
          await profilePage.verifyStateZipCounty({
            expectedState: "vt",
            expectedCounty: "ORANGE",
            expectedZip: "05077",
          });
        });
        test("FUNC-ZIP-NT006: Error Message Display for Non-Existent Zip Code Input", async () => {
          await profilePage.setStateAndZipCode("California", "05080");
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "We do not have data for the zip code you entered"
          );
        });
      });
      test.describe("1.3. Income field. Validation tests", () => {
        test("FUNC-INC-PT001: Handles a Valid yearly Income Input '$100000' correctly", async () => {
          await profilePage.fillFormElements({
            income: 100000,
          });
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).not.toBeVisible();
          await expect(profilePage.header2).toBeVisible();
        });
        test("FUNC-INC-PT002: Handles a Valid yearly Income Input '$0' correctly", async () => {
          await profilePage.fillFormElements({
            income: 0,
          });
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).not.toBeVisible();
          await expect(profilePage.header2).toBeVisible();
        });
        test("FUNC-INC-NT001: Error Message Display for an Empty yearly Income Input", async () => {
          await profilePage.fillFormElements({
            income: undefined,
          });
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "Please enter a valid income."
          );
        });
        test("FUNC-INC-NT002: Error Message Display for Negative Numbers in Yearly Income Field", async () => {
          await profilePage.fillFormElements({
            income: -100000,
            isSpouseCoverageAvailable: false,
          });
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "Please enter a valid income."
          );
        });
        test("FUNC-INC-NT003: Error Message for  letters/symbols in Yearly Income Field", async () => {
          await profilePage.fillFormElements({
            income: "fdw",
          });
          await profilePage.submitForm();
          await expect(profilePage.errorMessage).toBeVisible();
          await expect(profilePage.errorMessage).toHaveText(
            "Please enter a valid income."
          );
        });
      });
    });
  });
});
