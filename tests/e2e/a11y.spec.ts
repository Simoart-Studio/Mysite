import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/works', '/works/barberspace', '/polityka-prywatnosci']) {
  test(`WCAG 2.2 AA bez naruszeń: ${path}`, async ({ page }) => {
    await page.goto(path);
    // Przewinięcie odsłania sekcje animowane przy wejściu w ekran.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test('brak poziomego przewijania przy 320 px', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
});
