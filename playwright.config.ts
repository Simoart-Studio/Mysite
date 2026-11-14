import { defineConfig, devices } from '@playwright/test';

/**
 * Testy:
 *  - unit: logika bez przeglądarki (schemat formularza, sygnatury plików, limiter)
 *  - e2e: lokalny build produkcyjny (`npm run build` przed uruchomieniem)
 *  - smoke: tylko testy oznaczone @smoke, bez skutków ubocznych — na dowolnym adresie
 *    (BASE_URL=https://sp-flow.vercel.app npx playwright test --project=smoke)
 */
const BASE_URL = process.env.BASE_URL;
const local = 'http://localhost:3200';

export default defineConfig({
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: BASE_URL ?? local, trace: 'retain-on-failure' },
  projects: [
    { name: 'unit', testDir: 'tests/unit' },
    { name: 'desktop', testDir: 'tests/e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testDir: 'tests/e2e', use: { ...devices['Pixel 7'] } },
    { name: 'smoke', testDir: 'tests/e2e', grep: /@smoke/, use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: BASE_URL
    ? undefined
    : { command: 'npm run start -- -p 3200', url: local, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
