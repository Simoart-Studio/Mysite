import { test, expect } from '@playwright/test';

test('talia projektów: odsłanianie, szczegóły, zamknięcie klawiszem Esc', async ({ page }) => {
  await page.goto('/#works');
  const slider = page.locator('#works input[type=range]');
  await expect(slider).toHaveValue('0');
  await page.getByRole('button', { name: 'Odsłoń następną kartę' }).click();
  await expect(slider).toHaveValue('1');
  await slider.fill('3');
  await expect(slider).toHaveValue('3');
  await page.locator('[data-top=pile]').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('nawigacja: logo przewija na samą górę', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.mouse.wheel(0, -200);
  await page.locator('header[role=banner] a[aria-label*="strona główna"]').click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBe(0);
});
