import { test, expect } from '@playwright/test';

test.describe('formularz kontaktowy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
    await page.locator('#contact-form').scrollIntoViewIfNeeded();
  });

  test('walidacja w przeglądarce wskazuje brakujące pola', async ({ page }) => {
    await page.getByRole('button', { name: /Wyślij/ }).click();
    await expect(page.locator('#cf-name-err')).toHaveText('Podaj imię.');
    await expect(page.locator('#cf-name')).toBeFocused();
  });

  test('błędny adres strony jest odrzucany', async ({ page }) => {
    await page.fill('#cf-name', 'Jan');
    await page.fill('#cf-email', 'jan@firma.pl');
    await page.fill('#cf-site', 'to nie jest adres');
    await page.fill('#cf-message', 'Treść');
    await page.check('#cf-consent', { force: true });
    await page.getByRole('button', { name: /Wyślij/ }).click();
    await expect(page.locator('#cf-site-err')).toBeVisible();
  });

  test('serwer odrzuca plik wykonywalny podpisany jako PDF', async ({ page }) => {
    await page.fill('#cf-name', 'Jan');
    await page.fill('#cf-email', 'jan@firma.pl');
    await page.fill('#cf-message', 'Treść');
    await page.locator('#cf-attachment').setInputFiles({ name: 'brief.pdf', mimeType: 'application/pdf', buffer: Buffer.from('MZ\x90\x00 fake') });
    await page.check('#cf-consent', { force: true });
    await page.getByRole('button', { name: /Wyślij/ }).click();
    await expect(page.locator('#cf-attachment-err')).toContainText('Dozwolone pliki');
  });
});
