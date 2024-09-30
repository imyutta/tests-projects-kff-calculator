# Health Insurance Marketplace Calculator Tests

## Overview

This repository contains automated tests for the Health Insurance Marketplace
Calculator. The tests ensure that the calculator functions correctly and provides
accurate results for users seeking health insurance information.

Calculator: https://www.kff.org/interactive/subsidy-calculator/

## Test Plan is decribed here:

https://docs.google.com/spreadsheets/d/1VEj2ooECIcOPXO8ecsrcXb_TMyzTHbkjFsWKDVRDzWw/edit?usp=sharing

### Project Structure

- `page-models/` - Contains page models
- `tests/` - Contains test files for various functionalities of the Health Insurance Marketplace Calculator.
- `playwright.config.ts` - Playwright configuration file.
- `package.json` - Project dependencies and scripts.
- `test-setup` - This file handles Playwright's global configuration. It blocks all requests to analytics endpoints during test execution, ensuring no analytics data is sent. This prevents interference with the website's statistics while running tests
- `README.md` - This file.
