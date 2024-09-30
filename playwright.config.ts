import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: "html",

  timeout: 10000,

  globalSetup: require.resolve("./test-setup.ts"),

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
      outputDir: "test-results/firefox",
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      outputDir: "test-results/webkit",
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"] },
      outputDir: "test-results/chrome",
    },
    {
      name: "Pixel 5",
      use: { ...devices["Pixel 5"] },
      outputDir: "test-results/pixel5",
    },
    {
      name: "iPhone 12",
      use: { ...devices["iPhone 12"] },
      outputDir: "test-results/iphone12",
    },
  ],
});
