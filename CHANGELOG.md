# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersjonowanie: [SemVer](https://semver.org/lang/pl/).

## [1.0.0] — 2026-11-06

Pierwsze wydanie zgodne z `production-readiness-standard` (audyt: `docs/audit/2026-11-06/`).

### Bezpieczeństwo
- Aktualizacja Next.js do 16.4.5, React do 19.3.1 i nodemailer do 10.3.1 (usunięte znane podatności zależności produkcyjnych).
- Obrazy OG generowane tylko dla znanych projektów (nieznany adres → 404).
- Formularz: wspólny schemat walidacji, weryfikacja załącznika po zawartości, limit wiadomości per IP, wymuszone szyfrowanie połączenia SMTP, timeouty.
- Nagłówki bezpieczeństwa: CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP.
- `security.txt`.

### Jakość i operacje
- CI (typecheck, lint, audyt, build, testy, SBOM, skan sekretów), testy Playwright w repozytorium, smoke po wdrożeniu i co 6 h, Dependabot.
- Walidacja zmiennych środowiskowych przed buildem produkcyjnym, `.env.example`.
- Strony błędów (`error.tsx`, `global-error.tsx`), logi strukturalne z numerem zgłoszenia.
- Dokumentacja: architektura, runbook, plan incydentów, dokumentacja RODO.

### Wydajność
- Font z polskimi znakami 5 KB zamiast 85 KB, schemat formularza ładowany przy wysyłce, framer-motion przez `LazyMotion`.

### Treść
- Polityka prywatności: okres przechowywania, logi serwera, data aktualizacji.
