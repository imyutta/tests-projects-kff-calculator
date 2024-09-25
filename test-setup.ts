import { test as base } from "@playwright/test";
import { ProfilePage } from "./page-models/profile-page";

// Extend basic test by providing a "profilePage" fixture.
export const test = base.extend<{ profilePage: ProfilePage }>({
  // Define a fixture. Note that it can use built-in fixture "page"
  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);

    // Intercept analytics requests and block them
    await page.route("**/analytics/*", (route) => {
      route.abort(); // Block analytics requests
    });

    // Use the profilePage in the test
    await use(profilePage);
  },
});
