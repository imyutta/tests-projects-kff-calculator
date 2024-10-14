import test from "../test-setup";
import { expect, Locator } from "@playwright/test";
import { ProfilePage } from "../page-models/profile-page";

test.describe("KFF-Calculator", () => {
  let profilePage: ProfilePage;
  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.goto();
  });

  test("page loads correctly", async () => {
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

  test.describe("Functional tests", () => {
    test.describe("Zip Code and County mapping", () => {
      test("Displays correct county for valid California Zip Code", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");
      });
      test("County updates correctly with new Zip Code from the same state)", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");
        await profilePage.zipCode.fill("92070");
        await profilePage.verifyStateAndCounty("ca", "SAN DIEGO");
      });

      test("Zip code cleared and county hidden after changing the state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");

        await profilePage.selectState.selectOption("Utah");
        await expect(profilePage.zipCode).toBeEmpty;
        await expect(profilePage.county).not.toBeVisible();
      });
      test("State updated and county hidden after setting a zip code from a different state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");

        await profilePage.zipCode.fill("84080");
        await profilePage.emitInputChangeEvent(profilePage.zipCode);
        await profilePage.verifyStateAndCounty("ut");
      });
      test("Zip Code cleared and county hidden after selecting 'US Average' state", async () => {
        await profilePage.setStateAndZipCode("California", "90210");
        await profilePage.verifyStateAndCounty("ca", "LOS ANGELES");

        await profilePage.selectState.selectOption("US Average");
        await expect(profilePage.zipCode).not.toBeVisible();
        await expect(profilePage.county).not.toBeVisible();
      });
    });
    test.describe("Validation tests", () => {
      test("Error message is displayed after entering an invalid zip code", async () => {
        await profilePage.selectState.selectOption("California");
        await profilePage.zipCode.fill("001");
        await expect(profilePage.errorMessage).toBeVisible();
        await expect(profilePage.errorMessage).toContainText(
          "Please enter a valid income."
        );
      });
    });
  });
});
