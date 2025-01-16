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
    // Desktop Browsers
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
      outputDir: "test-results/desktop-chrome",
    },
    {
      name: "Desktop Firefox",
      use: { ...devices["Desktop Firefox"] },
      outputDir: "test-results/desktop-firefox",
    },
    {
      name: "Desktop Safari",
      use: { ...devices["Desktop Safari"] },
      outputDir: "test-results/desktop-safari",
    },
    {
      name: "Desktop Edge",
      use: { ...devices["Desktop Edge"] },
      outputDir: "test-results/edge",
    },
    // Mobile Devices
    {
      name: "Pixel 7",
      use: { ...devices["Pixel 7"] },
      outputDir: "test-results/pixel7",
    },
    {
      name: "Galaxy S23",
      use: { viewport: { width: 412, height: 915 } }, // Custom config for Galaxy
      outputDir: "test-results/galaxy-s23",
    },
    {
      name: "iPhone 5",
      use: { ...devices["iPhone 5"] },
      outputDir: "test-results/iphone12",
    },
    {
      name: "iPhone 14",
      use: { ...devices["iPhone 14"] },
      outputDir: "test-results/iphone14",
    },
    // Tablet
    {
      name: "iPad Pro",
      use: { ...devices["iPad Pro"] },
      outputDir: "test-results/ipad-pro",
    },
    {
      name: "Galaxy Tab S8",
      use: { viewport: { width: 1752, height: 2800 } }, // Custom dimensions
      outputDir: "test-results/galaxy-tab-s8",
    },
  ],
});
