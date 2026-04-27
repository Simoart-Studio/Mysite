import type { Metadata } from 'next';

export const SITE_URL = 'https://sp-flow.vercel.app';

export const siteMetadata = {
  title: 'Szymon Pochopień — Frontend Developer | Premium Websites',
  description:
    'Projektuję i buduję premium strony internetowe dla firm w Next.js i React. Portfolio, selected works, kontakt.',
  url: SITE_URL,
  author: 'Szymon Pochopień',
  keywords: [
    'frontend developer',
    'React',
    'Next.js',
    'web design',
    'portfolio',
    'strony internetowe',
    'Polska',
  ],
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteMetadata.title,
    template: '%s | Szymon Pochopień',
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE_URL,
    siteName: 'Szymon Pochopień Portfolio',
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
    canonical: SITE_URL,
  },
};
