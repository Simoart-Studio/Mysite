import { test, expect } from '@playwright/test';

// Testy tylko do odczytu — bezpieczne na produkcji (workflow „Smoke”).

test('@smoke strona główna działa i ma nagłówek', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Tworzymy spójną wizję');
  await expect(page.locator('#contact form')).toBeVisible();
});

test('@smoke nagłówki bezpieczeństwa', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['permissions-policy']).toContain('camera=()');
  expect(h['x-powered-by']).toBeUndefined();
});

test('@smoke wszystkie projekty i strona projektu', async ({ page }) => {
  await page.goto('/works');
  await expect(page.getByRole('link', { name: /BarberSpace/ }).first()).toBeVisible();
  const res = await page.goto('/works/travelpoint');
  expect(res?.status()).toBe(200);
});

test('@smoke 404 dla nieistniejących stron i obrazów OG', async ({ request }) => {
  expect((await request.get('/to-nie-istnieje')).status()).toBe(404);
  expect((await request.get('/works/nie-ma-takiego/opengraph-image')).status()).toBe(404);
  expect((await request.get('/works/travelpoint/opengraph-image')).status()).toBe(200);
});

test('@smoke robots, sitemap, security.txt', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/works/barberspace');
  expect(await (await request.get('/.well-known/security.txt')).text()).toContain('Contact: mailto:');
});

test('@smoke polityka prywatności bez placeholderów', async ({ page }) => {
  await page.goto('/polityka-prywatnosci');
  await expect(page.locator('main')).not.toContainText('do uzupełnienia');
});
