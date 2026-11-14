import type { MetadataRoute } from 'next';
import { BRAND } from '@/data/config';
import { siteMetadata } from '@/lib/metadata';

/**
 * Manifest aplikacji: ikona na ekranie głównym Androida i w „Dodaj do ekranu głównego”.
 * Ikony wygenerowane z logo (kostka „S”); wersja maskable ma kostkę w bezpiecznej strefie,
 * więc systemowe przycięcie do koła lub zaokrąglonego kwadratu jej nie obetnie.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND,
    short_name: 'SimoArt',
    description: siteMetadata.description,
    lang: 'pl',
    start_url: '/',
    display: 'browser',
    background_color: '#060807',
    theme_color: '#060807',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
