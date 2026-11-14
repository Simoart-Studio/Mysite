# SimoArt studio — strona

Strona-wizytówka SimoArt studio (Szymon Pochopień): projekty w formie interaktywnej talii kart,
asystent „Co chcesz zbudować?”, proces współpracy, formularz kontaktowy.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, SCSS Modules, Framer Motion, Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produkcyjny
npm run typecheck  # sprawdzenie typów
```

## Projekty: dane z GitHuba + nadpisania

Talia kart czyta dane z dwóch plików, które scala `src/lib/projects.ts`:

| Plik | Kto edytuje | Zawartość |
|---|---|---|
| `src/data/projects.json` | skrypt (nie edytuj ręcznie) | nazwa, opis, topics, języki (%), homepage, URL repo, daty, gwiazdki, wyciąg z README (cel, funkcje, stack) |
| `src/data/projects.overrides.json` | Ty | kolejność kart (`order`), własne opisy, status, etykiety, chipy technologii, zrzuty ekranu, `hidden` |

**Nadpisania mają pierwszeństwo.** Pole, którego nie ma ani w nadpisaniach, ani na GitHubie,
wyświetla się na stronie jako „Do uzupełnienia”. Nic nie jest dopisywane automatycznie.

### Odświeżenie danych

```bash
npm run projects                 # pobierz dane z GitHub API
npm run projects -- --strict     # zakończ z błędem, jeśli pobranie się nie uda
```

- **Token:** opcjonalny `GITHUB_TOKEN` (tylko odczyt) w zmiennych środowiskowych buildu/CI
  (Vercel → Settings → Environment Variables). Nigdy w kodzie ani w repozytorium.
  Bez tokenu skrypt widzi tylko repozytoria publiczne (limit 60 zapytań/h).
  Z tokenem pobierze też dane repozytoriów prywatnych wpisanych w `order`.
- **Błędy i limity API:** przy błędzie skrypt zostawia ostatni poprawny `projects.json`
  (całość albo pojedyncze pola). Build nigdy nie pada z powodu GitHuba.
- **Build:** `prebuild` odświeża dane automatycznie tylko w CI/Vercel (`CI` lub `VERCEL`).
  Lokalny `npm run build` nie zmienia plików.
- **Repozytoria prywatne:** na stronie nie ma do nich linku (dla odwiedzających byłby to błąd 404).

### Dodanie lub zmiana projektu

1. Dopisz nazwę repozytorium do `order` w `projects.overrides.json` (wyżej = bliżej wierzchu talii).
2. Dodaj wpis w `projects`: `slug`, `name`, `status` (`Wdrożony` / `W rozwoju` / `Prototyp`),
   `labels` (`projekt własny` / `demo` / `prototyp` / `klient`), `tagline`, `stack` (3–4 chipy) i case study:
   `forWho`, `problem`, `solution`, `scope`, `effect`, `challenge`, `limitations`.
3. Zrzuty ekranu w WebP wrzuć do `public/projects/<slug>/` i podaj wymiary (`width`, `height`, `device`).
4. `npm run projects`, potem `npm run build`.

## Zmienne środowiskowe

| Zmienna | Gdzie | Po co |
|---|---|---|
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Vercel (runtime) | wysyłka formularza kontaktowego |
| `GITHUB_TOKEN` | Vercel (build), opcjonalnie | dane repozytoriów do talii |

## Do uzupełnienia przed publikacją

- `src/app/polityka-prywatnosci/page.tsx` → adres/NIP, okres przechowywania danych, data aktualizacji
  (oznaczone na stronie). Tekst polityki to szkic do weryfikacji.
- `src/data/testimonials.ts` → prawdziwe opinie klientów (pusta lista = sekcja ukryta).
- `src/components/sections/About/About.tsx` → `PORTRAIT`, jeśli dodasz zdjęcie.
- Opisy projektów prywatnych (TravelPoint, Pawflo, Buds, SL) w `projects.overrides.json`.

## Dostępność i fallbacki

- Talia: obsługa klawiaturą (Enter/Spacja odsłania, strzałki nawigują, Esc zamyka),
  fokus przenoszony do otwartej karty i zwracany po zamknięciu, `prefers-reduced-motion` → bez odklejania.
- Bez JS albo przy błędzie: statyczna siatka kart z tymi samymi treściami (`ProjectGrid`).
- Podgląd demo (iframe) ładuje się dopiero po kliknięciu „Uruchom podgląd”.
