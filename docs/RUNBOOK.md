# Runbook — SimoArt studio

Właściciel i osoba dyżurna: Szymon Pochopień (szymon.pochopien01@gmail.com, +48 793 950 330).

## Wdrożenie

1. Zmiany na gałęzi → CI zielone (`.github/workflows/ci.yml`) → Vercel buduje preview.
2. Akceptacja właściciela → merge/push na `main` → Vercel wdraża produkcję.
3. Workflow „Smoke (produkcja)” uruchamia się po wdrożeniu — sprawdź, że jest zielony.
4. Po zmianach w formularzu lub zależnościach: wyślij wiadomość testową z załącznikiem PDF.

Checklista release'u: [DEPLOY.md](../DEPLOY.md#przed-wdrożeniem-na-produkcję) + skrócona bramka z [production-readiness/PRODUCTION-RELEASE-GO-NO-GO.md](production-readiness/PRODUCTION-RELEASE-GO-NO-GO.md#5-skrócona-bramka-dla-małych-zmian).

## Rollback

**Kiedy:** smoke czerwony po wdrożeniu, strona nie działa, formularz zwraca błędy, wyraźna regresja wyglądu.

1. Vercel → Project → Deployments → poprzednie wdrożenie z etykietą *Production* (zielone) → `⋯` → **Instant Rollback** (lub **Promote to Production**).
2. Sprawdź stronę i uruchom ręcznie workflow „Smoke (produkcja)” (Actions → Run workflow).
3. Napraw błąd na gałęzi, przejdź CI, wdroż ponownie. Instant Rollback blokuje automatyczne wdrożenia z `main`, dopóki nie wypromujesz nowego wdrożenia.

Docelowy czas: ≤ 15 min. **Do przećwiczenia** raz na kwartał na nieistotnej zmianie (zapisz datę i czas w CHANGELOG).

## Hotfix (poprawka pilna, np. bezpieczeństwa)

1. Gałąź `hotfix/…` z `main`, minimalna zmiana + test regresji.
2. CI musi być zielone (bez pomijania testów).
3. Wdrożenie natychmiast po akceptacji; smoke + ręczna weryfikacja; wpis w CHANGELOG.

## Rotacja sekretów

| Sekret | Gdzie | Jak zrotować | Kiedy |
|---|---|---|---|
| `GMAIL_APP_PASSWORD` | Vercel env (Production, Preview) | Konto Google → Bezpieczeństwo → Hasła aplikacji → usuń stare, utwórz nowe → wpisz w Vercel → Redeploy | podejrzenie wycieku: **natychmiast**; rutynowo raz w roku |
| `GITHUB_TOKEN` (opcjonalny) | Vercel env | GitHub → Settings → Developer settings → Fine-grained tokens → nowy token tylko do odczytu → Vercel → Redeploy → usuń stary | przy wygaśnięciu / podejrzeniu wycieku |

Po rotacji: wiadomość testowa przez formularz.

## Rate limiting

W aplikacji działa limiter w pamięci (3 wiadomości / 10 min i 10 / dobę z jednego IP). Na Vercelu każda instancja ma osobną pamięć, więc zalecana jest dodatkowa reguła platformy:

Vercel → Project → Firewall → Add Rule: *If* `Request Method` = `POST` **and** `Request Header` `next-action` *exists* → **Rate Limit** 10 żądań / 60 s per IP → akcja `Deny` (429).

## Monitoring

| Co | Narzędzie | Status |
|---|---|---|
| Dostępność strony, certyfikat, domena | GitHub Actions „Smoke (produkcja)” co 6 h (e-mail przy błędzie) | w repo |
| Dostępność co 5 min | UptimeRobot / Better Stack (darmowe) — monitor `https://sp-flow.vercel.app` i domeny | **do założenia** |
| Błędy formularza | logi Vercel (`contact_error`, `contact_rejected`) — Project → Logs, filtr `contact_` | w kodzie |
| Błędy JS w przeglądarce | Sentry (opcjonalnie, wymaga konta i DSN) | do decyzji |
| Core Web Vitals (dane polowe) | Vercel Speed Insights | aktywne |
| Podatności zależności | Dependabot + `npm audit` w CI | w repo |

## Scenariusze awarii (DR)

| Scenariusz | Działanie |
|---|---|
| Strona nie działa po wdrożeniu | [Rollback](#rollback) |
| Formularz nie wysyła (logi `contact_error` / `missing_smtp_env`) | sprawdź zmienne `GMAIL_*` w Vercel, limit Gmaila, hasło aplikacji; tymczasowo strona pokazuje bezpośredni e-mail |
| Wyciek hasła aplikacji Gmail | [rotacja](#rotacja-sekretów) natychmiast + przegląd skrzynki (wysłane) + [plan incydentu](INCIDENT-RESPONSE.md) |
| Przejęcie konta Vercel/GitHub/Google | odzyskanie konta, zmiana haseł, odwołanie sesji i tokenów, MFA, rotacja sekretów, przegląd ostatnich wdrożeń i commitów |
| Utrata domeny / błędny DNS | strona działa pod `sp-flow.vercel.app`; przywróć rekordy wg Vercel → Domains |
| Usunięcie projektu Vercel | nowy projekt z repozytorium GitHub, zmienne wg `.env.example`, domena wg `DEPLOY.md` |

Kopie: kod — GitHub + kopie lokalne; zapytania — Gmail (Google Takeout raz na kwartał).

## Strategia testów

| Poziom | Co | Gdzie |
|---|---|---|
| Unit | schemat formularza, sygnatury plików, limiter | `tests/unit` |
| E2E | formularz (walidacja, odrzucenie złośliwego pliku), talia projektów, nawigacja, 404 | `tests/e2e` (desktop + mobile) |
| Dostępność | axe WCAG 2.2 AA, reflow 320 px | `tests/e2e/a11y.spec.ts` |
| Smoke (produkcja) | dostępność, nagłówki, 404, SEO, polityka prywatności | `tests/e2e/smoke.spec.ts` (`@smoke`) |
| Manualnie przed większym release'em | czytnik ekranu (VoiceOver), Safari iOS, wiadomość testowa | — |
