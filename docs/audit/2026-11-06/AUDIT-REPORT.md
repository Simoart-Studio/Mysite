# Raport z audytu gotowości produkcyjnej — SimoArt studio (portfolio)

> Sporządzony wg [AUDIT-REPORT-TEMPLATE.md](../../production-readiness/AUDIT-REPORT-TEMPLATE.md) i [PRODUCTION-READINESS-MASTER-CHECKLIST.md](../../production-readiness/PRODUCTION-READINESS-MASTER-CHECKLIST.md) (wersja 1.0.0). Wypełniona checklista: [CHECKLIST.md](CHECKLIST.md) · Rejestr ryzyk: [../RISK-REGISTER.md](../RISK-REGISTER.md) · Decyzja: [GO-NO-GO.md](GO-NO-GO.md) · Dowody: [evidence/](evidence/)

## 1. Metryka

| Pole | Wartość |
|---|---|
| Nazwa projektu | SimoArt studio — portfolio Szymona Pochopienia |
| Wersja / commit SHA | `05f77df` (gałąź `main`, wdrożona na produkcję) |
| Data audytu | 2026-11-06 |
| Audytor | audyt wewnętrzny — **nie jest niezależny** od zespołu; zalecana weryfikacja P0/P1 przez drugą osobę (I.9 pkt 4) |
| Zleceniodawca / Product Owner | Szymon Pochopień |
| Stack technologiczny | Next.js 16.2.4 (App Router, Turbopack), React 19.2, TypeScript (strict), SCSS Modules, Framer Motion, Server Action + nodemailer (Gmail SMTP), Vercel (hosting, Web Analytics, Speed Insights) |
| Środowisko testów | Testy aktywne: lokalny build produkcyjny (`next build && next start`, commit `05f77df`, bez danych SMTP). Testy pasywne: produkcja `https://sp-flow.vercel.app`. |
| Profil projektu (I.9) | ☐ konta ☐ admin ☒ API (1 Server Action) ☐ webhooks ☒ integracje zewnętrzne (Gmail SMTP, GitHub API w buildzie) ☐ baza ☒ upload (załącznik do e-maila) ☐ płatności ☒ dane osobowe ☒ analityka (Vercel, bez cookies) ☐ PWA ☒ Next.js ☒ strona indeksowana |
| Wersja checklisty | PRODUCTION-READINESS-MASTER-CHECKLIST 1.0.0 (2026-11-06) |
| Zgoda na testy | Zlecenie właściciela w sesji z 2026-11-06 („zrób audyt kompleksowy mojej strony”). Zakres przyjęty przez audytora: na produkcji **wyłącznie testy pasywne** (GET/HEAD, Lighthouse, odczyt nagłówków), testy aktywne formularza tylko lokalnie. |

## 2. Zakres i wyłączenia

**W zakresie:** kod repozytorium `kameleon1312/szymon-studio` (cała historia git), konfiguracja Next.js, zależności, Server Action `sendEmail` (walidacja, upload, nagłówki e-mail, CSRF, limity), nagłówki HTTP i TLS produkcji, prywatność (cookies, storage, skrypty zewnętrzne, polityka prywatności), dostępność (WCAG 2.2 AA), SEO techniczne, wydajność (Lighthouse), procesy (CI, wdrożenia, monitoring, backup, incydenty).

**Wyłączenia:**

| Obszar wyłączony | Powód | Wpływ / rekomendacja |
|---|---|---|
| Wysyłka formularza na produkcji | Wysłałaby prawdziwą wiadomość — brak wyraźnej zgody na test aktywny na produkcji | NG-6 nieocenione → **RISK-008**; właściciel wysyła wiadomość testową |
| Domena `szymonfrontend.pl` | Nie odpowiada z sieci audytu (502 od strony upstream) | INF-005/007 = BLOCKED, SEO-022 = FAIL → **RISK-012** |
| Panel Vercel, rejestrator, konta Google/GitHub | Brak dostępu | ARC-023, INF-026 = BLOCKED; INF-022, LOG-011, SEO-030 = NOT TESTED → **RISK-026** |
| Preview deployments | Host zablokowany przez politykę sieci audytu (403) | SEO-002, INF-022 = NOT TESTED |
| Dane polowe CWV (Vercel Speed Insights) | Brak dostępu do panelu | PERF-002 = NOT TESTED; PERF-001 oceniony na danych lab |
| Czytniki ekranu, Firefox/WebKit/iOS Safari, fizyczne urządzenia | Środowisko audytu ma tylko Chromium | A11Y-019, QA-013, PWA-034 = NOT TESTED |
| Gitleaks / `npm audit signatures` | Pobranie binarki zablokowane; błąd pobrania podpisów w sieci audytu | ARC-020 oceniony własnym skanerem wzorców (zalecane potwierdzenie gitleaksem w CI); SCM-007 = NOT TESTED |
| Ocena prawna (RODO, PKE, UŚUDE, EAA) | Poza kompetencją audytu technicznego | Punkty oznaczone **[PRAWNIK]** wymagają potwierdzenia przez prawnika/IOD |

**Ograniczenia metodyczne:** skan wydajności to dane laboratoryjne (Lighthouse 12.6.1, profil mobile) — nie zastępuje danych polowych; testy dostępności to axe-core 4.10.3 + testy klawiatury, reflow i rozmiaru celów, bez testów z udziałem użytkowników; audytor nie jest niezależny od autora zmian.

## 3. Podsumowanie dla kierownictwa

- **Decyzja rekomendowana:** ☐ READY ☐ READY WITH ACCEPTED RISKS ☒ **NOT READY** ☐ BLOCKED
- **Najważniejsze wnioski:**
  Strona jest dopracowana od strony użytkownika: dostępność, dobre praktyki i SEO mają w Lighthouse po 100 punktów, axe nie znalazł żadnych naruszeń WCAG, nie ma ciasteczek ani śledzenia, a w repozytorium nie ma sekretów. Według standardu nie jest jednak gotowa produkcyjnie, z trzech powodów. **(1)** Używana wersja Next.js ma znane krytyczne podatności, a dwie dotyczą tej strony: formularza (Server Action) i obrazków podglądu (OG). Naprawa to aktualizacja Next.js. **(2)** Brakuje zaplecza operacyjnego: CI, testów w repozytorium, monitoringu i alertów, planu na incydenty i przećwiczonego rollbacku. Przykład: własna domena `szymonfrontend.pl` nie działa i nikt tego nie zauważył. **(3)** Polityka prywatności publicznie pokazuje „do uzupełnienia” (okres przechowywania, adres/NIP, data), a zapytania klientów trafiają na prywatnego Gmaila bez umowy powierzenia. Dodatkowo formularz nie ma limitu wysyłek i ochrony przed botami, a typ załącznika jest sprawdzany tylko po deklaracji przeglądarki.
- **Kryteria blokujące NG-1…NG-9 obecne:** ☒ tak:
  - **NG-1** — 21 punktów P0 z wynikiem FAIL i 4 P0 jako NOT TESTED;
  - **NG-9** — potencjalnie, bo polityka prywatności jest niekompletna (PRIV-002) i brakuje umowy powierzenia (PRIV-040); wymaga potwierdzenia prawnika;
  - **NG-6** — nie oceniono, bo działanie formularza na produkcji jest niezweryfikowane (RISK-008).

  NG-2, NG-3, NG-4, NG-5, NG-7 i NG-8 nie występują.

## 4. Statystyki

### 4.1 Statusy punktów kontrolnych

| Priorytet | PASS | FAIL | N/A | NOT TESTED | BLOCKED | Razem | Readiness % = PASS/(PASS+FAIL+NOT TESTED) |
|---|---|---|---|---|---|---|---|
| P0 | 29 | 21 | 72 | 4 | 0 | 126 | 54 % |
| P1 | 70 | 56 | 139 | 10 | 3 | 278 | 51 % |
| P2 | 36 | 23 | 53 | 4 | 2 | 118 | 57 % |
| P3 | 2 | 1 | 0 | 1 | 0 | 4 | 50 % |
| **Suma** | **137** | **101** | **264** | **19** | **5** | **526** | **53 %** |

Duży udział N/A wynika z profilu projektu: strona nie ma kont, bazy danych, płatności, webhooków ani PWA. Każdy N/A ma uzasadnienie w checkliście.

### 4.2 Znaleziska (Risk Register) wg priorytetu

| Priorytet | Otwarte | Naprawione i zretestowane | Zaakceptowane | Razem |
|---|---|---|---|---|
| P0 | 11 | 0 | — (niedozwolone) | 11 |
| P1 | 12 | 0 | 0 | 12 |
| P2 | 2 | 0 | 0 | 2 |
| P3 | 1 | 0 | 0 | 1 |

### 4.3 Wyniki per obszar

| Część checklisty | PASS | FAIL | N/A | NOT TESTED | BLOCKED | Uwagi |
|---|---|---|---|---|---|---|
| II Architektura i kod | 12 | 13 | 0 | 3 | 1 | TS strict OK, brak sekretów; brak CI, lint, schematu walidacji, dokumentacji |
| III Application Security | 13 | 8 | 23 | 0 | 0 | XSS/CRLF/CSRF OK; podatne zależności, brak rate limitingu, nagłówków, weryfikacji typu pliku |
| IV AuthN/AuthZ | 0 | 0 | 37 | 0 | 0 | Brak kont |
| V API | 8 | 9 | 18 | 0 | 0 | Jedna Server Action; brak limitów, schematu, wymuszonego TLS do SMTP |
| VI Bazy danych | 0 | 0 | 39 | 0 | 0 | Brak bazy |
| VII Infrastruktura | 12 | 9 | 5 | 2 | 3 | TLS/HSTS/cache OK; brak nagłówków bezpieczeństwa, rollback nieprzetestowany, domena własna nie działa |
| VIII Frontend | 12 | 1 | 2 | 0 | 0 | Bezpieczne renderowanie, iframe w sandboxie; podatna wersja Next.js w bundlu |
| IX Wydajność | 12 | 4 | 7 | 3 | 0 | CLS 0; LCP strony głównej 3,2 s (lab), brak budżetu JS |
| X Testy/QA | 5 | 9 | 5 | 4 | 0 | Testy audytu wykonane, ale brak testów w repo i smoke po wdrożeniu |
| XI Dostępność | 17 | 0 | 5 | 1 | 0 | axe 0 naruszeń; brak testu z czytnikiem ekranu |
| XII SEO | 15 | 3 | 3 | 2 | 0 | SEO 100; domena kanoniczna, apple-touch-icon |
| XIII Prywatność/prawo | 6 | 9 | 11 | 0 | 1 | Brak cookies/śledzenia; niekompletna polityka, brak DPA, brak retencji |
| XIV E-commerce/płatności | 0 | 0 | 25 | 0 | 0 | Brak płatności |
| XV Upload/storage | 5 | 2 | 11 | 0 | 0 | Allow-lista i limit OK; brak magic bytes, brak retencji |
| XVI Logi/monitoring/IR | 3 | 11 | 6 | 1 | 0 | Brak error trackingu, alertów, planu incydentów |
| XVII Backup/DR | 2 | 5 | 6 | 0 | 0 | Aplikacja bezstanowa (odtwarzalna z repo); brak RPO/RTO i planu DR |
| XVIII Supply chain | 3 | 9 | 3 | 1 | 0 | Brak SCA w CI, Dependabot, SBOM |
| XIX PWA/mobile | 4 | 0 | 10 | 1 | 0 | Nie-PWA; mobile web OK |
| XX Technologie (Next.js) | 6 | 3 | 43 | 0 | 0 | Brak `headers()`, `error.tsx`, schematu w Server Action |
| XXI Release | 2 | 6 | 5 | 1 | 0 | Akceptacja właściciela przed wdrożeniem; brak walidacji env, smoke, changelogu |

## 5. Najważniejsze ryzyka

| # | RISK-ID | Punkt | Priorytet | Opis (skrót) | Wpływ biznesowy | Status |
|---|---|---|---|---|---|---|
| 1 | RISK-001 | SEC-031 | P0 | `next@16.2.4` z krytycznymi podatnościami (DoS Server Actions, RCE `next/og`) dotyczącymi formularza i tras OG | Unieruchomienie formularza; w najgorszym razie wykonanie kodu w funkcji serwerowej z dostępem do hasła aplikacji Gmail | Open |
| 2 | RISK-015 | PRIV-002, PRIV-073 | P0 | Polityka prywatności z publicznym „do uzupełnienia”, brak retencji | Niezgodność z art. 13 RODO; nieprofesjonalny odbiór przez klientów | Open |
| 3 | RISK-007 | ARC-021, REL-004 | P0 | Brak walidacji konfiguracji; stan `GMAIL_*` na produkcji niepotwierdzony | Zapytania klientów mogą nie docierać bez żadnego sygnału | Open |
| 4 | RISK-011 | LOG-010, LOG-011 | P0 | Brak monitoringu i alertów (domena własna nie działa niezauważona) | Awarie wykrywane dopiero przez klientów | Open |
| 5 | RISK-003 | SEC-020 | P1 | Brak rate limitingu i ochrony antybotowej formularza | Zalew skrzynki, wyczerpanie limitu Gmaila — formularz przestaje działać | Open |
| 6 | RISK-004 | FILE-002 | P0 | Typ załącznika weryfikowany tylko po MIME z przeglądarki | Złośliwy plik w skrzynce właściciela (kompensacja: filtry Gmaila) | Open |
| 7 | RISK-012 | SEO-022 | P1 | Domena `szymonfrontend.pl` nie odpowiada | Klienci z wizytówek/linków trafiają w próżnię; SEO na subdomenie vercel.app | Open |
| 8 | RISK-005 | HDR-001…009 | P1 | Brak nagłówków bezpieczeństwa (CSP, frame-ancestors, nosniff…) | Clickjacking; brak drugiej linii obrony | Open |

Pełna lista (26 pozycji): [../RISK-REGISTER.md](../RISK-REGISTER.md).

## 6. Szczegóły znalezisk P0/P1

### RISK-001 — Podatna wersja Next.js (i nodemailer)
- Punkt kontrolny: SEC-031 (P0), SCM-002, FE-015 · Poziom ryzyka: 3 × 5 = 15 (High)
- Lokalizacja: `package.json` (`next@16.2.4`, `nodemailer@8.0.7`), `src/app/works/[slug]/opengraph-image.tsx`, `src/app/actions/sendEmail.ts`
- Opis: `npm audit` zgłasza dla `next` m.in.: *Unauthenticated RCE in next/og ImageResponse* (≥16.2.0 <16.3.6), *Denial of Service in App Router using Server Actions* (≤16.4.0), *SSRF in Image Optimization*, *information disclosure in metadata image routes via dynamicParams bypass*. Strona używa Server Action i tras OG; trasa `/works/<dowolny>/opengraph-image` renderuje `ImageResponse` w runtime dla nieznanego sluga (500), więc podatności mają zastosowanie.
- Kroki: `npm audit --json`; `curl -I https://sp-flow.vercel.app/works/xyz-nie-ma/opengraph-image` → `HTTP/2 500`, `x-vercel-cache: MISS`.
- Dowód: [evidence/npm-audit.json](evidence/npm-audit.json), [evidence/og-image-runtime.txt](evidence/og-image-runtime.txt)
- Rekomendacja: `npm i next@16.4.5 react@^19.3 react-dom@^19.3 nodemailer@^10.3`; `export const dynamicParams = false` w trasach OG/Twitter; build + testy QA; retest `npm audit` (0 Critical/High).
- Odniesienia: OWASP Top 10:2025 A03; ASVS 5.0 V15
- Retest: —

### RISK-015 — Niekompletna polityka prywatności i retencja [PRAWNIK]
- Punkt kontrolny: PRIV-002 (P0), PRIV-073 (P0), PRIV-053, PRIV-070, FILE-016 · Poziom: 5 × 3 = 15 (High)
- Lokalizacja: `src/app/polityka-prywatnosci/page.tsx`
- Opis: Strona publicznie wyświetla „do uzupełnienia” przy adresie/NIP, okresie przechowywania zapytań bez współpracy i dacie aktualizacji. Wiadomości i załączniki zostają w Gmailu bezterminowo.
- Dowód: przegląd treści (`/polityka-prywatnosci`), kod komponentu `Todo`
- Rekomendacja: uzupełnić okres przechowywania (np. 12 mies. od ostatniego kontaktu), datę, dane administratora (lub usunąć pole, jeśli prawnik potwierdzi, że przy osobie fizycznej bez działalności nie jest wymagane); w Gmailu etykieta + cykliczne usuwanie.

### RISK-007 — Konfiguracja bez walidacji; formularz na produkcji niepotwierdzony
- Punkt kontrolny: ARC-021 (P0), REL-004 (P0), ARC-024 · Poziom: 3 × 4 = 12 (High)
- Lokalizacja: `src/app/actions/sendEmail.ts` (sprawdzenie zmiennych w runtime), brak `.env.example`
- Opis: Brak `GMAIL_USER`/`GMAIL_APP_PASSWORD` nie blokuje buildu ani startu — formularz zwraca „Formularz jest chwilowo niedostępny” (zweryfikowano lokalnie). W notatkach projektu konfiguracja tych zmiennych na Vercelu była oznaczona jako „do uzupełnienia”.
- Dowód: [evidence/form-without-smtp-env.txt](evidence/form-without-smtp-env.txt)
- Rekomendacja: walidacja zmiennych w buildzie produkcyjnym (`VERCEL_ENV=production` → błąd przy braku), `.env.example`, wiadomość testowa po wdrożeniu (RISK-008).

### RISK-011 — Brak monitoringu i alertów
- Punkt kontrolny: LOG-010 (P0), LOG-011 (P0, NOT TESTED), LOG-012, LOG-016, LOG-017, EXT-006 · Poziom: 4 × 3 = 12 (High)
- Opis: Brak error trackingu, zewnętrznego uptime monitoringu (lub nie potwierdzono), alertów; domena własna nie działa niezauważona.
- Rekomendacja: uptime monitor (strona główna + domena), Sentry dla frontendu i Server Action, powiadomienia Vercel o nieudanych wdrożeniach.

### RISK-004 — Weryfikacja typu załącznika [P0 wg checklisty, poziom Medium]
- Punkt kontrolny: FILE-002 (P0), SEC-039 (P0) · Poziom: 3 × 3 = 9 (Medium)
- Kroki: wywołanie akcji z plikiem `faktura.pdf.exe` (zawartość zaczyna się od `MZ`), `Content-Type: application/pdf` → walidacja przechodzi (akcja dochodzi do etapu SMTP).
- Dowód: [evidence/server-action-tests.json](evidence/server-action-tests.json), skrypt [evidence/scripts/server-action-tests.cjs](evidence/scripts/server-action-tests.cjs)
- Rekomendacja: sprawdzenie sygnatury (pierwsze bajty) i rozszerzenia; test regresji w CI.

### RISK-006 — Walidacja wejścia bez schematu [P0 wg checklisty, poziom Low]
- Punkt kontrolny: ARC-010, API-010, NEXT-001 (P0) · Poziom: 2 × 2 = 4 (Low)
- Opis: `goal`/`budget`/`siteUrl` bez allow-listy i formatu. Obniżenie priorytetu do P2 możliwe wyłącznie decyzją właściciela z wpisem w rejestrze (I.5).
- Rekomendacja: schemat Zod współdzielony przez klienta i serwer.

### RISK-009 — Brak CI i testów w repozytorium
- Punkt kontrolny: QA-004 (P0), QA-010 (P0), SCM-001 (P0), REL-020 (P0), ARC-031, ARC-033 i in. · Poziom: 3 × 3 = 9 (Medium)
- Rekomendacja: GitHub Actions (`npm ci`, tsc, ESLint, `npm audit --audit-level=high`, gitleaks, Playwright) + smoke po wdrożeniu; przenieść 67 scenariuszy Playwright z audytu do `tests/`.

### RISK-013, RISK-014, RISK-016, RISK-021 — procesy i dokumentacja
- RISK-013 (LOG-020, PRIV-060 — P0): brak planu incydentów i procedury naruszeń RODO.
- RISK-014 (INF-024, REL-007 — P0, NOT TESTED): rollback Vercel nieprzećwiczony.
- RISK-016 (PRIV-040, PRIV-001 — P0) **[PRAWNIK]**: prywatny Gmail bez umowy powierzenia, brak inwentarza danych.
- RISK-021 (BCK-001 — P0): brak RPO/RTO, runbooka, diagramu, threat modelu, procedury rotacji sekretów.

### RISK-003 — Brak rate limitingu formularza (P1)
- Punkt kontrolny: SEC-020, API-021, API-022 · Poziom: 4 × 3 = 12 (High)
- Kroki: 30 poprawnych wywołań akcji pod rząd → 30 × HTTP 200, 129 ms łącznie (lokalnie).
- Rekomendacja: Vercel Firewall (reguła rate limit dla POST z nagłówkiem `Next-Action`) lub limit w akcji (Upstash Redis), Cloudflare Turnstile weryfikowany na serwerze.

### RISK-012 — Domena własna nie działa (P1)
- Punkt kontrolny: SEO-022 (FAIL), INF-005, INF-007 (BLOCKED) · Poziom: 5 × 3 = 15 (High)
- Dowód: [evidence/headers-prod.txt](evidence/headers-prod.txt) — `szymonfrontend.pl`, `www.szymonfrontend.pl`: CONNECT 502 (upstream), `sp-flow.vercel.app`: 200.
- Rekomendacja: sprawdzić DNS u rejestratora wg Vercel → Domains, ustawić przekierowanie 308 na jedną wersję hosta, zmienić `SITE_URL` w `src/lib/metadata.ts`.

### RISK-005 — Brak nagłówków bezpieczeństwa (P1)
- Punkt kontrolny: HDR-001…006, HDR-009, SEC-011, SEC-018, NEXT-008 · Poziom: 3 × 3 = 9 (Medium)
- Dowód: [evidence/prod-paths.txt](evidence/prod-paths.txt) — tylko `strict-transport-security`.
- Rekomendacja: `headers()` w `next.config.js` (CSP, `frame-ancestors 'none'`, nosniff, Referrer-Policy, Permissions-Policy, COOP).

### Pozostałe P1
RISK-017 (SMTP bez `requireTLS`), RISK-018 (timeouty SMTP), RISK-019 (500 dla nieznanego sluga OG, brak `error.tsx`), RISK-020 (LCP 3,2 s — `<h1>` z animacją wejścia), RISK-022 (brak logów zdarzeń bezpieczeństwa), RISK-023 (supply chain), RISK-010 (brak ochrony gałęzi), RISK-008 i RISK-026 (wymagają potwierdzenia właściciela) — opisy i naprawy w rejestrze.

## 7. Rekomendacje

| Horyzont | Rekomendacja | Powiązane punkty |
|---|---|---|
| Przed kolejnym wdrożeniem (P0) | Aktualizacja `next` (≥16.4.5) i `nodemailer`; `dynamicParams=false` w trasach OG | SEC-031, SEC-036 |
| | Uzupełnienie polityki prywatności (retencja, data, dane administratora) | PRIV-002, PRIV-073, PRIV-053 |
| | Walidacja `GMAIL_*` w buildzie + `.env.example`; wiadomość testowa na produkcji | ARC-021, REL-004, QA-004 |
| | Sprawdzenie typu załącznika po sygnaturze; schemat Zod w akcji | FILE-002, ARC-010 |
| | Minimalny CI (npm ci, tsc, audit, gitleaks, Playwright) + smoke po wdrożeniu | QA-004, QA-010, SCM-001, SCM-002, REL-020 |
| | Uptime monitor + Sentry; przećwiczony rollback; 1-stronicowy plan incydentów i runbook | LOG-010, LOG-011, LOG-020, INF-024, BCK-001 |
| | Umowa powierzenia: Google Workspace (lub inna skrzynka z DPA) + DPA Vercel **[PRAWNIK]** | PRIV-040 |
| ≤ 30 dni (P1) | Rate limiting + Turnstile; nagłówki bezpieczeństwa; naprawa DNS domeny; `requireTLS` i timeouty SMTP; `error.tsx`; LCP ≤ 2,5 s; ochrona gałęzi lub udokumentowany wyjątek; Dependabot | SEC-020, HDR-*, SEO-022, EXT-003/004, NEXT-012, PERF-001, ARC-030, SCM-003 |
| ≤ 90 dni (P2) | Aktualizacja nodemailer do 10.x (jeśli nie wcześniej), `apple-touch-icon`, `security.txt`, SBOM | SEC-031, SEO-013, LOG-024, SCM-008 |
| Strategiczne | Testy z czytnikiem ekranu i na iOS/Android; Lighthouse CI z budżetem; niezależny przegląd P0/P1 przez drugą osobę; kalendarz utrzymania wg [PRODUCTION-MAINTENANCE-CALENDAR.md](../../production-readiness/PRODUCTION-MAINTENANCE-CALENDAR.md) | A11Y-019, QA-013, PERF-009 |

## 8. Dowody i artefakty

| Artefakt | Lokalizacja | Wersja narzędzia / komenda |
|---|---|---|
| Raport SCA | [evidence/npm-audit.json](evidence/npm-audit.json), [evidence/npm-outdated.txt](evidence/npm-outdated.txt) | `npm audit --json`, `npm outdated` (npm 10, Node 22) |
| Raport SAST | — | Nie wykonano (brak Semgrep/CodeQL); przegląd manualny kodu serwerowego |
| Skan sekretów | [evidence/secrets-history.txt](evidence/secrets-history.txt), [evidence/bundle.txt](evidence/bundle.txt) | Skrypt wzorców po `git log --all -p` (32 commity) + grep `.next/static` |
| Testy Server Action | [evidence/server-action-tests.json](evidence/server-action-tests.json), [evidence/crlf-nodemailer.txt](evidence/crlf-nodemailer.txt) | Playwright 1.x + `fetch` (format RSC `1_*`/`0`), nodemailer `streamTransport` |
| Nagłówki, TLS, ścieżki | [evidence/prod-paths.txt](evidence/prod-paths.txt), [evidence/headers-prod.txt](evidence/headers-prod.txt), [evidence/misc-headers.txt](evidence/misc-headers.txt), [evidence/tls.txt](evidence/tls.txt), [evidence/og-image-runtime.txt](evidence/og-image-runtime.txt) | `curl -I`, `openssl s_client` (OpenSSL 3) |
| Prywatność (cookies, storage, hosty) | [evidence/privacy-prod.txt](evidence/privacy-prod.txt) | Playwright Chromium, produkcja |
| Lighthouse | [evidence/lighthouse-summary.txt](evidence/lighthouse-summary.txt) | Lighthouse 12.6.1, mobile, produkcja |
| axe / klawiatura / reflow / cele | [evidence/axe-results.json](evidence/axe-results.json), [evidence/target-size.txt](evidence/target-size.txt) | axe-core 4.10.3 (WCAG 2.0–2.2 A/AA + best-practice) |
| SEO | [evidence/seo-meta.txt](evidence/seo-meta.txt) | `curl` + parser meta |
| Ustawienia repozytorium | [evidence/branch-protection.txt](evidence/branch-protection.txt), [evidence/repo-settings.txt](evidence/repo-settings.txt) | GitHub REST API |
| TypeScript | [evidence/tsc.txt](evidence/tsc.txt) | `tsc --noEmit` (TypeScript 5.9) |
| Skrypty testów | [evidence/scripts/](evidence/scripts/) | do ponownego uruchomienia przy reteście |
| ZAP baseline, testssl.sh, SBOM | — | Nie wykonano (brak narzędzi w środowisku audytu) |
| Protokół testu odtworzenia / rollbacku | — | Brak (BCK-010 oceniony na podstawie wdrożeń z repo; INF-024 NOT TESTED) |
| Wypełniona checklista | [CHECKLIST.md](CHECKLIST.md) | 526 punktów |

## 9. Decyzja GO/NO-GO

Formularz: [GO-NO-GO.md](GO-NO-GO.md)

| Decyzja | ☐ READY ☐ READY WITH ACCEPTED RISKS ☒ **NOT READY** ☐ BLOCKED |
|---|---|
| Uzasadnienie | NG-1: 21 × FAIL P0 i 4 × NOT TESTED P0. NG-9 potencjalnie (PRIV-002, PRIV-040 — do potwierdzenia przez prawnika). NG-6 nieocenione (RISK-008). Strona już działa publicznie — decyzja oznacza, że nie spełnia standardu i wymaga napraw P0 w kolejnym wdrożeniu, a nie konieczność jej wyłączenia. |
| Zaakceptowane ryzyka | Brak (P0 nie podlega akceptacji). |
| Warunki | Naprawa RISK-001, 004, 006, 007, 009, 011, 013, 014, 015, 016, 021 → retest → nowa decyzja. |
| Termin kolejnego audytu / retestu | Po wdrożeniu poprawek P0, najpóźniej 2026-12-06. |

## 10. Podpisy / akceptacja

| Rola | Imię i nazwisko | Data | Podpis / zatwierdzenie |
|---|---|---|---|
| Audytor | audyt wewnętrzny | 2026-11-06 | raport w repozytorium |
| Tech Lead | Szymon Pochopień | | |
| Product Owner (decyzja) | Szymon Pochopień | | |
| IOD / prawnik (jeśli oceniał część prawną) | — | | |

---

*Raport dotyczy wyłącznie commitu `05f77df` i konfiguracji produkcji w dniu 2026-11-06. Nie stanowi porady prawnej ani nie zastępuje testu penetracyjnego — zob. „Known Limitations & Audit Boundaries” w checkliście.*
