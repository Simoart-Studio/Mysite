import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { baseMetadata, baseViewport } from '@/lib/metadata';
import { buildPersonSchema } from '@/lib/schema';
import { ClientProviders } from '@/components/ClientProviders/ClientProviders';
import '@/styles/globals.scss';
import { JsonLd } from '@/components/JsonLd/JsonLd';

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

const personSchema = buildPersonSchema();
const IS_PROD = process.env.NODE_ENV === 'production';
// Vercel ustawia VERCEL=1 — tylko tam istnieją ścieżki /_vercel/… dla Analytics i Speed Insights.
const ON_VERCEL = IS_PROD && process.env.VERCEL === '1';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Wczesne pobranie czcionek tylko na produkcji — w trybie deweloperskim style wchodzą później
            i przeglądarka zgłaszałaby „preloaded but not used”. */}
        {IS_PROD && <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />}
        {IS_PROD && <link rel="preload" href="/fonts/inter-latin-pl.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />}
        {/* eslint-disable-next-line react/no-danger -- stały skrypt bez danych wejściowych (klasa `js` przed pierwszym renderem) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <noscript>
          <style>{'[style*="opacity:0"]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <JsonLd data={personSchema} />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Przejdź do treści
        </a>
        <ClientProviders>
          {children}
        </ClientProviders>
        {/* Tylko na Vercelu: skrypty idą wtedy z tej samej domeny (/_vercel/…), więc CSP ich nie blokuje.
            Lokalnie ładowałyby się z va.vercel-scripts.com (blokada CSP) albo trafiały w 404. */}
        {ON_VERCEL && <Analytics />}
        {ON_VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}
