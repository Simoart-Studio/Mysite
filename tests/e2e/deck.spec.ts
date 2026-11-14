import { test, expect } from '@playwright/test';

test('lista projektów: szczegóły w oknie, zamknięcie Esc, powrót fokusu', async ({ page }) => {
  await page.goto('/#works');
  const tile = page.locator('#works ul a').first();
  await expect(tile).toHaveAttribute('href', /\/works\//);
  await tile.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(tile).toBeFocused();
});

test('nawigacja: logo przewija na samą górę', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.mouse.wheel(0, -200);
  await page.locator('header[role=banner] a[aria-label*="strona główna"]').click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBe(0);
});
