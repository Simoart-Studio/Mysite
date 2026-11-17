# Deploy — SimoArt studio (Vercel)

Hosting: Vercel z integracją GitHub. Gałąź `main` → produkcja, każda inna gałąź i PR → wdrożenie preview.
Procedury operacyjne (rollback, rotacja sekretów, incydenty): [docs/RUNBOOK.md](docs/RUNBOOK.md).

## Pierwsze podpięcie (jednorazowo)

1. **Import projektu:** [vercel.com/new](https://vercel.com/new) → *Import Git Repository* → `Simoart-Studio/Mysite`.
   Jeśli repozytorium nie jest widoczne: *Adjust GitHub App Permissions* → nadaj aplikacji Vercel dostęp
   do organizacji Simoart-Studio.
2. **Ustawienia buildu:** zostaw domyślne — Vercel sam wykrywa Next.js (`vercel.json` to potwierdza).
   Nie zmieniaj *Build Command* ani *Output Directory*. Wersja Node pochodzi z `package.json` (`engines`: 22.x).
3. **Zmienne środowiskowe** (*Environment Variables*, przed pierwszym deployem — patrz tabela niżej).
   Bez `GMAIL_USER` i `GMAIL_APP_PASSWORD` build **produkcyjny** celowo kończy się błędem.
4. **Deploy.** Po zakończeniu strona działa pod `https://<nazwa-projektu>.vercel.app`.
5. **Monitoring po wdrożeniu (opcjonalnie):** GitHub → repozytorium → *Settings → Secrets and variables →
   Actions → Variables* → dodaj `PROD_URL` = adres produkcji (np. `https://simoart.vercel.app`).
   Od tej chwili workflow „Smoke (produkcja)” sprawdza stronę po każdym wdrożeniu i co 6 godzin.

## Zmienne środowiskowe

Opis każdej zmiennej: [.env.example](.env.example). Vercel → Project → *Settings → Environment Variables*.

| Zmienna | Środowisko | Wymagana | Do czego |
|---|---|---|---|
| `GMAIL_USER` | Production (+ Preview, jeśli formularz ma działać w preview) | **tak** | skrzynka formularza kontaktowego |
| `GMAIL_APP_PASSWORD` | jw. | **tak** | hasło aplikacji Google (16 znaków), nie hasło do konta |
| `NEXT_PUBLIC_SITE_URL` | Production | nie | własna domena, np. `https://simoart.pl` (bez niej: domena produkcyjna Vercel) |
| `GITHUB_TOKEN` | Production, Preview | nie | token tylko do odczytu — dane prywatnych repo w talii projektów |
| `ALLOW_MISSING_MAIL` | Production | **tylko tymczasowo** | `1` = pozwala zbudować produkcję bez skrzynki Gmail (formularz pokazuje „chwilowo niedostępny” i odsyła do e-maila/telefonu). **Usuń** zaraz po dodaniu `GMAIL_USER` i `GMAIL_APP_PASSWORD`. |

`npm run build` uruchamia najpierw `scripts/check-env.mjs` (walidacja zmiennych), potem
`scripts/fetch-projects.mjs` (dane z GitHuba; gdy API nie odpowiada, zostają ostatnie poprawne dane — build nie pada).

## Co jest skonfigurowane automatycznie

- **Adres strony** (canonical, sitemap, `robots.txt`, obrazy OG, dane strukturalne, `security.txt`) —
  z `NEXT_PUBLIC_SITE_URL`, a bez niej z domeny produkcyjnej, którą Vercel podaje przy buildzie
  (`VERCEL_PROJECT_PRODUCTION_URL`). Nic nie trzeba zmieniać w kodzie przy zmianie domeny.
- **Preview bez indeksowania** — wdrożenia preview mają `noindex` i `Disallow: /` w `robots.txt`,
  a canonical wskazuje produkcję (brak duplikatów w Google).
- **Region funkcji: Frankfurt (`fra1`)** — formularz kontaktowy (Server Action) działa blisko użytkowników z Polski.
- **Nagłówki bezpieczeństwa** (CSP, HSTS po stronie Vercel, X-Frame-Options itd.) — `next.config.js`.
  Na preview CSP dopuszcza pasek komentarzy Vercel (`vercel.live`); produkcja ma ścisłą politykę.
- **Analityka** — `@vercel/analytics` i `@vercel/speed-insights` (bez cookies) ładują się tylko na Vercelu;
  włącz je w panelu: Project → *Analytics* i *Speed Insights* → *Enable*. Opis w polityce prywatności (sekcja 5).

## Własna domena

1. Vercel → Project → *Settings → Domains* → dodaj domenę (np. `simoart.pl`) i `www.simoart.pl`.
2. U rejestratora ustaw rekordy pokazane przez Vercel (A dla domeny głównej, CNAME dla `www`).
3. Wybierz jedną wersję hosta jako główną — druga przekierowuje 308.
4. Ustaw `NEXT_PUBLIC_SITE_URL` (Production) na wybraną domenę i zrób *Redeploy*.
5. Zaktualizuj zmienną `PROD_URL` w GitHubie i zgłoś `https://<domena>/sitemap.xml` w Google Search Console.

## Przed wdrożeniem na produkcję

- [ ] CI zielone (typecheck, lint, audit, build, testy E2E, skan sekretów) — `.github/workflows/ci.yml`
- [ ] Zmiany w formularzu lub zależnościach → po wdrożeniu wiadomość testowa przez formularz
- [ ] Po wdrożeniu: workflow „Smoke (produkcja)” zielony

## Uwagi

- `security.txt` (RFC 9116) jest generowany przy każdym buildzie z ważnością ~12 miesięcy — wystarczy
  wdrożyć stronę przynajmniej raz w roku.
- Ikony (favicon, Apple, Android) wygenerowano z logo: `python scripts/make-icons.py public/logo.png <katalog>`.
