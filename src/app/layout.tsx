import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { baseMetadata, baseViewport } from '@/lib/metadata';
import { buildPersonSchema, jsonLd } from '@/lib/schema';
import { ClientProviders } from '@/components/ClientProviders/ClientProviders';
import '@/styles/globals.scss';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500'],
  preload: true,
});

// Nagłówki: bez wstępnego ładowania (nie konkuruje z pierwszym renderem),
// dopasowany font zastępczy ogranicza przesunięcie przy podmianie.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

const schemaString = jsonLd(buildPersonSchema());

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Oznacza, że JS działa — bez niego pokazujemy statyczną siatkę projektów */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <noscript>
          {/* Framer Motion renderuje stan początkowy (opacity: 0). Bez JS pokazujemy treść. */}
          <style>{'[style*="opacity:0"]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaString }}
        />
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
