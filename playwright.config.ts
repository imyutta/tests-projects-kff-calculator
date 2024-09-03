import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: "html",

  timeout: 10000,

  use: {
    baseURL: "https://www.kff.org/interactive/subsidy-calculator/",

    trace: "on-first-retry",

    video: "retain-on-failure",

    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
