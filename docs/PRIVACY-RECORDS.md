# Dokumentacja RODO — SimoArt studio

> Dokument roboczy administratora. Nie jest poradą prawną — punkty oznaczone **[PRAWNIK]** wymagają potwierdzenia.

## Inwentarz danych

| Dane | Źródło | Cel | Podstawa | Gdzie przechowywane | Retencja |
|---|---|---|---|---|---|
| Imię, e-mail, treść, cel, budżet, adres strony, załącznik | formularz kontaktowy | odpowiedź na zapytanie, przygotowanie oferty | art. 6 ust. 1 lit. a i b RODO | Gmail (skrzynka właściciela) | 12 mies. od ostatniego kontaktu bez współpracy; przy współpracy — czas trwania + okres z przepisów |
| Adres IP, user-agent, czas żądania | każde żądanie HTTP | bezpieczeństwo, ograniczanie nadużyć | art. 6 ust. 1 lit. f RODO | logi Vercel; pamięć funkcji (limiter, ≤ 24 h) | wg retencji logów Vercel (planu); limiter ≤ 24 h |
| Zbiorcze statystyki odsłon i wydajności | Vercel Web Analytics / Speed Insights | statystyka, wydajność | art. 6 ust. 1 lit. f RODO | Vercel | wg Vercel; bez cookies i identyfikatorów między stronami |
| Dane z rezerwacji rozmowy | Calendly (zewnętrzny serwis) | umówienie rozmowy | art. 6 ust. 1 lit. b RODO | Calendly | wg Calendly / ustawień konta |

Logi aplikacji (`contact_*`) nie zawierają danych osobowych — tylko numer zgłoszenia, wynik i powód odrzucenia.

## Podmioty przetwarzające i umowy powierzenia

| Dostawca | Rola | Umowa powierzenia (art. 28) | Transfer poza EOG | Status |
|---|---|---|---|---|
| Vercel Inc. | hosting, logi, analityka | Vercel Data Processing Addendum (dokumenty prawne Vercel) | USA — EU-US DPF / SCC | **do potwierdzenia: akceptacja DPA w koncie** |
| Google (Gmail) | skrzynka z zapytaniami | **konto prywatne (konsumenckie) nie zapewnia umowy powierzenia** | USA — DPF | **[PRAWNIK] rekomendacja: Google Workspace (z Data Processing Amendment) lub inna skrzynka firmowa z DPA** |
| Calendly | rezerwacje (gdy klient sam z niej korzysta) | DPA Calendly | USA — DPF | do potwierdzenia |

## Rejestr czynności przetwarzania (art. 30)

**[PRAWNIK]** Zwolnienie z art. 30 ust. 5 nie obejmuje przetwarzania, które nie ma charakteru sporadycznego — obsługa zapytań z formularza jest regularna. Bezpieczniej prowadzić rejestr; wzór: tabela „Inwentarz danych” powyżej uzupełniona o kategorie osób (potencjalni klienci) i opis zabezpieczeń (TLS, MFA, ograniczony dostęp do skrzynki).

## Obsługa żądań osób (art. 15–21)

1. Żądanie wpływa na e-mail (adres w polityce prywatności). Zapisz datę.
2. Potwierdź tożsamość (odpowiedź z tego samego adresu, z którego przyszło zapytanie).
3. Wyszukaj dane w Gmailu (adres e-mail nadawcy, numer zgłoszenia `ref` z wiadomości) i w Calendly.
4. Realizacja:
   - **dostęp / przeniesienie** — przekaż kopię wiadomości (eksport .eml lub PDF) i informację z polityki prywatności;
   - **usunięcie / cofnięcie zgody** — usuń wątek i załączniki z Gmaila (także z Kosza);
   - **sprostowanie, ograniczenie, sprzeciw** — odpowiednio oznacz lub usuń.
5. Odpowiedz w ciągu **1 miesiąca** (art. 12 ust. 3). Zapisz datę realizacji.

## Retencja — mechanizm

Raz w miesiącu: w Gmailu wyszukaj `subject:"Nowe zapytanie" older_than:1y` i usuń wątki, z których nie wynikła współpraca. Opcjonalnie: filtr nadający etykietę „Formularz” wszystkim wiadomościom z tematem „Nowe zapytanie”.

## Rejestr naruszeń

| Data stwierdzenia | Opis | Dane / osoby | Ocena ryzyka | Zgłoszenie do UODO (data) | Powiadomienie osób | Działania |
|---|---|---|---|---|---|---|
| — | brak | — | — | — | — | — |
