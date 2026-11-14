# Retest po naprawach — 2026-11-06

> Retest punktów z audytu ([AUDIT-REPORT.md](AUDIT-REPORT.md)). Wyniki audytu w [CHECKLIST.md](CHECKLIST.md) pozostają bez zmian (zasada I.10: nowy dowód zamiast nadpisywania); aktualne statusy ryzyk: [../RISK-REGISTER.md](../RISK-REGISTER.md).
>
> Zakres: gałąź robocza, commity `22639e8` → `dc2c9f3`. Weryfikacja: lokalny build produkcyjny, CI GitHub Actions (run `42214456006` — zielony), preview Vercel (build `success`). **Produkcja nie była jeszcze aktualizowana** — punkty oznaczone „po wdrożeniu” wymagają powtórzenia testu `@smoke` i Lighthouse na `https://sp-flow.vercel.app`.

## Punkty P0 z audytu

| Punkt | Audyt | Retest | Dowód | Po wdrożeniu |
|---|---|---|---|---|
| SEC-031 | FAIL | **PASS** | `npm audit --omit=dev` = 0; CI krok „Audyt zależności” | potwierdzić 404 trasy OG na produkcji |
| ARC-010, API-010, NEXT-001 | FAIL | **PASS** | schemat Zod; [evidence/retest-server-action.txt](evidence/retest-server-action.txt); `tests/unit/contact.spec.ts` | — |
| SEC-039, FILE-002 | FAIL | **PASS** | weryfikacja sygnatury + rozszerzenia; plik `MZ…` jako PDF odrzucony | — |
| ARC-021, REL-004 | FAIL | **PASS** | `scripts/check-env.mjs` w `prebuild` | build produkcyjny zakończy się błędem, jeśli `GMAIL_*` nie są ustawione — to zamierzone |
| QA-004 | FAIL | **PASS** | E2E formularza i talii w CI (desktop + mobile) | rzeczywista dostawa e-maila — RISK-008 |
| QA-010, REL-020 | FAIL | **PASS** | `.github/workflows/smoke.yml` po każdym wdrożeniu produkcyjnym | pierwszy run po wdrożeniu |
| SCM-001, SCM-002 | FAIL | **PASS** | `npm ci --ignore-scripts` + `npm audit` blokujący w CI; Dependabot | — |
| PRIV-001 | FAIL | **PASS** | [../../PRIVACY-RECORDS.md](../../PRIVACY-RECORDS.md) | — |
| PRIV-002 | FAIL | **PASS** [PRAWNIK — potwierdzenie] | polityka bez placeholderów: retencja, logi, data | test `@smoke` |
| PRIV-060, LOG-020 | FAIL | **PASS** | [../../INCIDENT-RESPONSE.md](../../INCIDENT-RESPONSE.md) | ćwiczenie (LOG-021) |
| BCK-001 | FAIL | **PASS** | RPO/RTO w [../../ARCHITECTURE.md](../../ARCHITECTURE.md#ciągłość-działania) | — |
| PRIV-073 | FAIL | **BLOCKED** | placeholder usunięty; podane imię, nazwisko, e-mail | właściciel: czy prowadzi działalność (wtedy adres i NIP są wymagane) |
| PRIV-040 | FAIL | **FAIL** | brak umowy powierzenia dla prywatnego Gmaila | właściciel / [PRAWNIK] |
| LOG-010 | FAIL | **FAIL** | logi strukturalne są, brak error trackingu z alertami | właściciel: Sentry (konto + DSN) albo akceptacja Vercel Logs jako jedynego źródła |
| LOG-011 | NOT TESTED | **FAIL** | smoke co 6 h to za rzadko na monitoring dostępności | właściciel: UptimeRobot / Better Stack (5 min) |
| INF-024, REL-007, QA-022 | NOT TESTED | **NOT TESTED** | procedura w [../../RUNBOOK.md](../../RUNBOOK.md#rollback) | właściciel: próba Instant Rollback (≈ 10 min) |

## Punkty P1 (wybrane)

| Punkt | Audyt | Retest | Dowód |
|---|---|---|---|
| SEC-018, SEC-011, HDR-001…006, HDR-009, NEXT-008 | FAIL | **PASS** (lokalnie, CI) | `curl -I` lokalnie; test `@smoke nagłówki bezpieczeństwa`; brak naruszeń CSP w scenariuszach E2E |
| SEC-020, API-021 | FAIL | **PASS** (kompensacja) | limiter w aplikacji + test; zalecana reguła Vercel Firewall |
| API-022 | FAIL | **FAIL** | brak CAPTCHA/Turnstile (wymaga konta Cloudflare) |
| SEC-036, ARC-011, NEXT-012 | FAIL | **PASS** | 404 dla nieznanych tras OG, `error.tsx`, `global-error.tsx`, numer zgłoszenia |
| SEC-038, API-025, LOG-001 | FAIL | **PASS** | logi JSON `contact_*` z `ref` i wersją wdrożenia |
| EXT-003, EXT-004, PERF-060 | FAIL | **PASS** | `requireTLS`, timeouty 10 s |
| ARC-001, ARC-002, ARC-024, ARC-034, API-001, INF-021, BCK-004, BCK-005, BCK-012, QA-001, REL-001, REL-024 | FAIL | **PASS** | `docs/ARCHITECTURE.md`, `docs/RUNBOOK.md`, `.env.example`, `DEPLOY.md` |
| ARC-031, ARC-032, ARC-033, QA-002, QA-003, QA-006, QA-007, QA-009 | FAIL | **PASS** | CI + ESLint (0 błędów) + testy Playwright |
| SCM-003, SCM-006, SCM-008, SCM-012 | FAIL | **PASS** | Dependabot, `--ignore-scripts`, SBOM, gitleaks w CI |
| ARC-020 | PASS (skrypt) | **PASS** (gitleaks) | CI job „Skan sekretów” na całej historii |
| SEO-013, LOG-024 | FAIL | **PASS** | `/apple-icon`, `/.well-known/security.txt` |
| PERF-001, PERF-009 | FAIL | **do pomiaru po wdrożeniu** | lokalnie: JS 253 → 228 KB, fonty 133 → 53 KB, TBT 170 → 60 ms; LCP obserwowany 190 ms, symulowany 2,9–3,6 s |
| ARC-030, SCM-011 | FAIL | **FAIL** | brak ochrony gałęzi (plan Free) — decyzja właściciela |
| SEO-022, INF-005, INF-007 | FAIL / BLOCKED | **bez zmian** | DNS domeny — właściciel |
| PRIV-053, PRIV-070, FILE-016 | FAIL | **PASS** [PRAWNIK] | retencja 12 mies. + procedura usuwania w `PRIVACY-RECORDS.md` |

## Prognoza decyzji

Po wdrożeniu na produkcję i zielonym smoke zostaje 5 grup P0 — wszystkie wymagają działania właściciela, nie kodu:

1. **PRIV-073** — potwierdzenie, czy potrzebny jest adres/NIP.
2. **PRIV-040** — skrzynka z umową powierzenia (lub opinia prawnika).
3. **LOG-010** — error tracking.
4. **LOG-011** — zewnętrzny monitoring dostępności.
5. **INF-024 / REL-007 / QA-022** — jedna próba rollbacku.

Do tego czasu decyzja pozostaje **NOT READY** (NG-1). Po ich zamknięciu i decyzji co do P1 (rate limiting na poziomie platformy, Turnstile, ochrona gałęzi, domena) możliwa jest decyzja **READY WITH ACCEPTED RISKS**.

## Retest produkcji — 2026-11-06 (commit `15bd2c1`)

| Test | Wynik | Dowód |
|---|---|---|
| Smoke `@smoke` na `https://sp-flow.vercel.app` | 6/6 PASS | [evidence/retest-prod-smoke.txt](evidence/retest-prod-smoke.txt) |
| Formularz → e-mail (RISK-008, QA-004) | PASS — wiadomość testowa właściciela dostarczona | jw. |
| Lighthouse mobile `/` | Performance 95 (było 86), A11y/BP/SEO 100, LCP 2,5 s (było 3,2 s), CLS 0, TBT 160 ms | [evidence/retest-prod-lighthouse.txt](evidence/retest-prod-lighthouse.txt) |
| Lighthouse mobile `/works`, `/works/travelpoint` | Performance 99 i 100, LCP 2,1 s i 1,2 s | jw. |

Wnioski: SEC-031, HDR-*, SEC-018, SEC-036, PERF-001 (lab, próg 2,5 s), PRIV-002 — **PASS na produkcji**. Poprawka po wdrożeniu: limit wysyłek liczy tylko poprawne zgłoszenia (`15bd2c1`) — wcześniej nieudane próby walidacji blokowały formularz.

**Decyzja nadal NOT READY** — otwarte P0 wymagające działania właściciela: PRIV-073, PRIV-040, LOG-010, LOG-011, INF-024/REL-007/QA-022 (szczegóły wyżej, „Prognoza decyzji”).

## Aktualizacja — 2026-11-06 (informacje od właściciela)

| Punkt | Status | Uzasadnienie |
|---|---|---|
| PRIV-073 | **PASS** | Właściciel nie prowadzi działalności gospodarczej — wystarczy imię, nazwisko i e-mail. Po założeniu JDG: dopisać adres i NIP. |
| SEO-022, INF-005, INF-007 | **PASS / N/A** | Brak własnej domeny — jedynym hostem jest `sp-flow.vercel.app` (spójnie w canonical, sitemap, `SITE_URL`). Kontrola domeny usunięta ze smoke do czasu jej zakupu. |
| QA-010, REL-020 | **PASS** (poprawka) | Smoke po wdrożeniu testował chroniony adres wdrożenia (`*-kameleon1312s-projects.vercel.app` → strona logowania Vercel). Teraz zawsze testuje adres produkcyjny. |

Pozostałe otwarte P0: PRIV-040, LOG-010, LOG-011, INF-024/REL-007/QA-022.
