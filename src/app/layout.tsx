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
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-pl.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
