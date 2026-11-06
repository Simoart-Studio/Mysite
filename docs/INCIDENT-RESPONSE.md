# Plan reagowania na incydenty — SimoArt studio

Wersja uproszczona dla jednoosobowej działalności, na podstawie [production-readiness/INCIDENT-RESPONSE-PLAN.md](production-readiness/INCIDENT-RESPONSE-PLAN.md).

**Incident Commander i kontakt:** Szymon Pochopień — szymon.pochopien01@gmail.com, +48 793 950 330.
**Zgłoszenia podatności:** `/.well-known/security.txt`.

## Poziomy

| SEV | Przykład | Reakcja |
|---|---|---|
| SEV1 | wyciek danych z formularza lub hasła SMTP, przejęcie konta Vercel/GitHub/Google, podmiana treści strony | natychmiast |
| SEV2 | strona lub formularz nie działa > 1 h | w ciągu kilku godzin |
| SEV3 | błąd wyglądu, pojedyncze błędy | w ramach normalnej pracy |

## Kroki

1. **Wykrycie** — alert (smoke, uptime, logi), zgłoszenie od klienta lub przez `security.txt`. Zapisz godzinę.
2. **Ograniczenie** — rollback ([RUNBOOK](RUNBOOK.md#rollback)), rotacja sekretów ([RUNBOOK](RUNBOOK.md#rotacja-sekretów)), wylogowanie sesji, tymczasowe wyłączenie formularza (usunięcie zmiennych `GMAIL_*` → strona pokazuje bezpośredni e-mail).
3. **Ocena** — czy dotyczy danych osobowych (treść zapytań, e-maile, załączniki)? Jakich osób, ilu, jakie ryzyko?
4. **Zgłoszenie naruszenia (RODO art. 33–34)** — jeśli naruszenie ochrony danych może powodować ryzyko dla osób:
   - **do Prezesa UODO w ciągu 72 h** od stwierdzenia — elektroniczny formularz zgłoszenia naruszenia dostępny na stronie uodo.gov.pl;
   - przy wysokim ryzyku — **powiadomienie osób, których dane dotyczą** (szablon niżej);
   - każde naruszenie (także niezgłaszane) wpisz do rejestru naruszeń w [PRIVACY-RECORDS.md](PRIVACY-RECORDS.md#rejestr-naruszeń).
5. **Naprawa** — poprawka przez ścieżkę hotfix ([RUNBOOK](RUNBOOK.md#hotfix-poprawka-pilna-np-bezpieczeństwa)), retest.
6. **Po incydencie** — krótki opis (co, kiedy, przyczyna, działania), wpis w `docs/audit/RISK-REGISTER.md`, aktualizacja tego planu.

## Szablony komunikatów

**Awaria (strona/formularz):**
> Formularz kontaktowy jest chwilowo niedostępny. Napisz bezpośrednio na szymon.pochopien01@gmail.com lub zadzwoń: +48 793 950 330. Przepraszam za utrudnienia.

**Naruszenie danych (do osoby, której dotyczy):**
> Dzień dobry, informuję, że [data] doszło do incydentu, w wyniku którego [opis: jakie dane, np. treść wiadomości wysłanej przez formularz] mogły zostać ujawnione osobie nieuprawnionej. Możliwe skutki: [opis]. Podjąłem działania: [opis]. Zalecam: [np. uważać na podejrzane wiadomości]. Kontakt w sprawie incydentu: szymon.pochopien01@gmail.com. Szymon Pochopień

## Ćwiczenie

Raz w roku (i przed większą zmianą) przejdź scenariusz „wyciek hasła aplikacji Gmail”: rotacja hasła, wiadomość testowa, ocena obowiązku zgłoszenia. Zapisz datę w CHANGELOG.
