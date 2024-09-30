import { test } from "../test-setup";
import { expect } from "@playwright/test";
// import { ProfilePage } from "../page-models/profile-page";

test("page load", async ({ profilePage }) => {
  await profilePage.goto();
});
