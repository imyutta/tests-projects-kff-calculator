import { test } from "../test-setup";
import { expect } from "@playwright/test";
import { ProfilePage } from "../page-models/profile-page";

test("page load", async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.goto();
  await expect(
    page.getByRole("heading", { name: "Health Insurance Marketplace" })
  ).toBeVisible();
  await expect(page.getByPlaceholder("Yearly income")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});
