import { test, expect } from "@playwright/test";

test("page load", async ({ page }) => {
  await page.goto("https://www.kff.org/interactive/subsidy-calculator/");
  await expect(
    page.getByRole("heading", { name: "Health Insurance Marketplace" })
  ).toBeVisible();
  await expect(page.getByPlaceholder("Yearly income")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});
