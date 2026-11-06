# Deploy — SimoArt studio

Hosting: Vercel (integracja z GitHub). `main` → produkcja, inne gałęzie → preview.
Procedury operacyjne (rollback, rotacja sekretów, incydenty): [docs/RUNBOOK.md](docs/RUNBOOK.md).

## Zmienne środowiskowe

Opis każdej zmiennej: [.env.example](.env.example). Ustawiasz je w Vercel → Settings → Environment Variables.

| Zmienna | Środowisko | Wymagana |
|---|---|---|
| `GMAIL_USER` | Production (+ Preview, jeśli formularz ma działać w preview) | tak — build produkcyjny bez niej kończy się błędem |
| `GMAIL_APP_PASSWORD` | jw. | tak |
| `GITHUB_TOKEN` | Production, Preview | nie (tylko odczyt, dane repozytoriów przy buildzie) |

`npm run build` uruchamia najpierw `scripts/check-env.mjs` (walidacja zmiennych), potem `scripts/fetch-projects.mjs` (dane z GitHuba).

## Domena

1. Vercel → Project → Settings → Domains → dodaj `szymonfrontend.pl` i `www.szymonfrontend.pl`.
2. U rejestratora ustaw rekordy pokazane przez Vercel (A dla domeny głównej, CNAME dla `www`).
3. Wybierz jedną wersję hosta jako główną; druga przekierowuje 308.
4. Po działającej domenie zmień `SITE_URL` w `src/lib/metadata.ts` oraz `Canonical`/`Policy` w `public/.well-known/security.txt`, wdróż i zgłoś sitemapę w Google Search Console.

## Przed wdrożeniem na produkcję

- [ ] CI zielone (typecheck, lint, audit, build, testy E2E) — `.github/workflows/ci.yml`
- [ ] Zmiany w formularzu lub zależnościach → wiadomość testowa po wdrożeniu
- [ ] Po wdrożeniu: workflow „Smoke (produkcja)” zielony

## Analityka

`@vercel/analytics` i `@vercel/speed-insights` (bez cookies) są w `src/app/layout.tsx`. Opis w polityce prywatności (sekcja 5).
