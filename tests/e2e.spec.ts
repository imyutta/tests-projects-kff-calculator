import test from "../test-setup";
import { expect, Locator } from "@playwright/test";
import { ProfilePage } from "../page-models/profile-page";

test.describe("KFF-Calculator", () => {
  test("page loads correctly", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

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
