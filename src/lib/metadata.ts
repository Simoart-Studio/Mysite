import type { Metadata, Viewport } from 'next';
import { BRAND, OWNER } from '@/data/config';

/**
 * Adres strony (canonical, sitemap, robots, OG, dane strukturalne). Kolejność:
 * 1. NEXT_PUBLIC_SITE_URL — ustawiony ręcznie (np. własna domena: https://simoart.pl),
 * 2. VERCEL_PROJECT_PRODUCTION_URL — domena produkcyjna projektu, którą Vercel podaje przy każdym buildzie
 *    (także w preview — dzięki temu canonical z preview wskazuje produkcję, nie adres wdrożenia),
 * 3. lokalnie: http://localhost:3000.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

/** Indeksowanie tylko produkcji: wdrożenia preview (gałęzie, PR) dostają noindex — bez duplikatów w Google. */
export const INDEXABLE = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

export const siteMetadata = {
  title: `Strony i aplikacje, które pracują dla Twojej firmy | ${BRAND}`,
  description:
    'Projektuję i buduję strony firmowe, sklepy internetowe i aplikacje webowe (PWA) w React i Next.js. Zobacz projekty, proces współpracy i napisz do mnie.',
  url: SITE_URL,
  author: OWNER,
  keywords: [
    'strony internetowe',
    'sklep internetowy',
    'aplikacja webowa',
    'PWA',
    'Next.js',
    'React',
    'projektowanie stron',
    BRAND,
  ],
};

/* pasek przeglądarki na telefonie w kolorze tła strony (ciemny motyw — zgodnie z color-scheme w CSS) */
export const baseViewport: Viewport = {
  themeColor: '#060807',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteMetadata.title,
    template: `%s | ${BRAND}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  applicationName: BRAND,
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE_URL,
    siteName: BRAND,
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  robots: {
    index: INDEXABLE,
    follow: INDEXABLE,
    googleBot: {
      index: INDEXABLE,
      follow: INDEXABLE,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      locale: 'pl_PL',
      url: path,
      siteName: BRAND,
      title: `${title} | ${BRAND}`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${BRAND}`,
      description,
    },
  };
}
