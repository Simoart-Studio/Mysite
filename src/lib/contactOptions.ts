/** Opcje formularza bez zależności — importowane przy renderowaniu (schemat Zod ładuje się dopiero przy wysyłce). */

export const GOALS = [
  'Strona firmowa',
  'Sklep internetowy',
  'Aplikacja webowa',
  'Aplikacja mobilna (PWA)',
  'MVP / prototyp',
  'Redesign obecnej strony',
  'Inne',
] as const;

export const BUDGETS = [
  'Do 5 000 zł',
  '5 000 – 10 000 zł',
  '10 000 – 20 000 zł',
  'Powyżej 20 000 zł',
  'Nie wiem jeszcze',
] as const;

export const LIMITS = { name: 120, email: 200, siteUrl: 300, message: 5000 } as const;
