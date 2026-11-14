import type { Metadata, Viewport } from 'next';
import { BRAND, OWNER } from '@/data/config';

export const SITE_URL = 'https://sp-flow.vercel.app';

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
