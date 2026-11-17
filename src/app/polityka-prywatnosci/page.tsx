import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { BRAND, OWNER, EMAIL, ATTACHMENT_MAX_MB } from '@/data/config';
import { SiteShell } from '@/components/hybrid/SiteShell';
import styles from './page.module.scss';

export const metadata: Metadata = pageMetadata({
  title: 'Polityka prywatności',
  description: `Jak ${BRAND} przetwarza dane z formularza kontaktowego i jakie masz prawa. Bez ciasteczek śledzących.`,
  path: '/polityka-prywatnosci',
});

const UPDATED = '6 listopada 2026';
const RETENTION_MONTHS = 12;

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main id="main-content" className={styles.page}>
        <article className={styles.article}>
          <Link href="/" className={styles.back}>← Strona główna</Link>
          <h1>Polityka prywatności</h1>
          <p className={styles.lead}>
            Krótko: zbieram tylko dane, które sam(a) podajesz w formularzu albo w mailu. Używam ich, żeby odpowiedzieć
            na Twoje zapytanie. Strona nie używa ciasteczek śledzących ani reklamowych.
          </p>

          <h2>1. Kto jest administratorem danych</h2>
          <p>
            {OWNER}, prowadzący {BRAND}. Kontakt we wszystkich sprawach dotyczących danych:{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>

          <h2>2. Jakie dane zbieram i po co</h2>
          <p>Formularz kontaktowy przesyła:</p>
          <ul>
            <li>imię i adres e-mail, żeby móc odpowiedzieć,</li>
            <li>cel projektu, adres obecnej strony i orientacyjny budżet (opcjonalnie), żeby przygotować propozycję,</li>
            <li>treść wiadomości i załącznik (opcjonalnie, do {ATTACHMENT_MAX_MB} MB), żeby zrozumieć Twój problem.</li>
          </ul>
          <p>
            Podstawa prawna: Twoja zgoda (art. 6 ust. 1 lit. a RODO) oraz działania przed zawarciem umowy na Twoje
            żądanie (art. 6 ust. 1 lit. b RODO). Podanie danych jest dobrowolne, ale bez adresu e-mail nie mogę odpowiedzieć.
          </p>
          <p>
            Przy każdym wejściu na stronę serwer hostingu zapisuje techniczne dane połączenia (m.in. adres IP, typ
            przeglądarki, czas żądania) w logach. Służą one bezpieczeństwu strony i ograniczaniu nadużyć formularza,
            np. limitowi liczby wiadomości z jednego adresu IP. Podstawa prawna: prawnie uzasadniony interes
            (art. 6 ust. 1 lit. f RODO).
          </p>

          <h2>3. Komu przekazuję dane</h2>
          <ul>
            <li>Google (Gmail): wiadomość z formularza trafia na moją skrzynkę pocztową,</li>
            <li>Vercel Inc.: hosting strony,</li>
            <li>Calendly: tylko jeśli sam(a) umówisz rozmowę przez Calendly (obowiązuje wtedy ich polityka prywatności).</li>
          </ul>
          <p>
            Część tych dostawców działa poza Europejskim Obszarem Gospodarczym. Przekazanie opiera się na standardowych
            klauzulach umownych lub decyzji Komisji Europejskiej (EU-US Data Privacy Framework).
          </p>

          <h2>4. Jak długo przechowuję dane</h2>
          <p>
            Wiadomości z formularza (razem z załącznikami) przechowuję przez {RETENTION_MONTHS} miesięcy od ostatniego
            kontaktu, jeśli nie podejmiemy współpracy — potem je usuwam. Jeśli podejmiemy współpracę, przechowuję je
            przez czas jej trwania i okres wymagany przepisami (np. podatkowymi). Wcześniej usunę je na Twoją prośbę
            albo po cofnięciu zgody. Techniczne logi serwera są przechowywane przez dostawcę hostingu przez krótki
            okres (zwykle do kilku dni).
          </p>

          <h2>5. Statystyki i ciasteczka</h2>
          <p>
            Strona używa Vercel Web Analytics i Vercel Speed Insights. Zbierają zanonimizowane, zbiorcze dane
            (np. liczbę odsłon, kraj, typ urządzenia, czas ładowania) bez ciasteczek i bez identyfikowania Cię
            między stronami. Dlatego strona nie wyświetla banera cookies.
          </p>

          <h2>6. Twoje prawa</h2>
          <p>
            Masz prawo do dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia,
            sprzeciwu oraz do cofnięcia zgody w dowolnym momencie (bez wpływu na wcześniejsze przetwarzanie).
            Napisz na <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Możesz też złożyć skargę do Prezesa Urzędu Ochrony
            Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).
          </p>

          <p className={styles.meta}>Ostatnia aktualizacja: {UPDATED}.</p>
        </article>
      </main>
    </SiteShell>
  );
}
