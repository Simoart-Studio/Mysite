import { test, expect } from '@playwright/test';
import { contactSchema, normalizeSiteUrl } from '../../src/lib/contactSchema';
import { verifyFile } from '../../src/lib/server/fileSignature';
import { checkContactLimit, resetRateLimit } from '../../src/lib/server/rateLimit';

const valid = { name: 'Jan', email: 'jan@firma.pl', goal: '', budget: '', siteUrl: '', message: 'Treść', consent: true };

test.describe('schemat formularza', () => {
  test('przyjmuje poprawne dane', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  for (const [name, patch, field] of [
    ['cel spoza listy', { goal: 'Hack' }, 'goal'],
    ['budżet spoza listy', { budget: '1 zł' }, 'budget'],
    ['adres z przecinkiem (dwóch odbiorców)', { email: 'a@x.pl,b@y.pl' }, 'email'],
    ['brak zgody', { consent: false }, 'consent'],
    ['pusta wiadomość', { message: '   ' }, 'message'],
    ['za długie imię', { name: 'x'.repeat(121) }, 'name'],
    ['URL javascript:', { siteUrl: 'javascript:alert(1)' }, 'siteUrl'],
  ] as const) {
    test(`odrzuca: ${name}`, () => {
      const r = contactSchema.safeParse({ ...valid, ...patch });
      expect(r.success).toBe(false);
      expect(r.error?.issues[0]?.path[0]).toBe(field);
    });
  }

  test('normalizuje adres strony', () => {
    expect(normalizeSiteUrl('mojafirma.pl')).toBe('https://mojafirma.pl/');
    expect(normalizeSiteUrl('http://a.pl/x')).toBe('http://a.pl/x');
    expect(normalizeSiteUrl('')).toBe('');
    expect(normalizeSiteUrl('ftp://a.pl')).toBeNull();
    expect(normalizeSiteUrl('localhost')).toBeNull();
  });
});

test.describe('sygnatury plików', () => {
  const pdf = new Uint8Array([...Buffer.from('%PDF-1.7\n'), 0, 0]);
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
  const exe = new Uint8Array([...Buffer.from('MZ'), 0x90, 0]);

  test('akceptuje zgodną zawartość i rozszerzenie', () => {
    expect(verifyFile(pdf, 'brief.pdf')).toBe('application/pdf');
    expect(verifyFile(png, 'Zrzut.PNG')).toBe('image/png');
  });

  test('odrzuca plik wykonywalny udający PDF', () => {
    expect(verifyFile(exe, 'faktura.pdf')).toBeNull();
    expect(verifyFile(exe, 'faktura.pdf.exe')).toBeNull();
  });

  test('odrzuca niezgodne rozszerzenie', () => {
    expect(verifyFile(pdf, 'x.exe')).toBeNull();
    expect(verifyFile(png, 'a.pdf')).toBeNull();
  });
});

test('limiter: 3 wiadomości na 10 minut z jednego IP', () => {
  resetRateLimit();
  const now = 1_000_000;
  expect([1, 2, 3, 4].map(() => checkContactLimit('1.2.3.4', now).ok)).toEqual([true, true, true, false]);
  expect(checkContactLimit('5.6.7.8', now).ok).toBe(true);
  expect(checkContactLimit('1.2.3.4', now + 11 * 60_000).ok).toBe(true);
});
