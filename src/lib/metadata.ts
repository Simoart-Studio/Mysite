import type { Metadata, Viewport } from 'next';
import { BRAND, OWNER } from '@/data/config';

export const SITE_URL = 'https://sp-flow.vercel.app';

export const siteMetadata = {
  title: `${BRAND} — strony i aplikacje, które pracują dla Twojej firmy`,
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

export const baseViewport: Viewport = {
  themeColor: '#F5EEE5',
  colorScheme: 'light',
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

/** Metadane podstrony: własny title, description, canonical, OG i Twitter. */
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
