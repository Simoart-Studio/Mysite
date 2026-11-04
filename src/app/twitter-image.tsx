import { renderOg, OG_SIZE } from '@/lib/og';
import { BRAND } from '@/data/config';

export const alt = `${BRAND}: strony i aplikacje`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    eyebrow: 'Strony · Sklepy · Aplikacje',
    title: 'Strony i aplikacje, które pracują dla Twojej firmy.',
    subtitle: 'Projekt, wdrożenie i rozwój. React, Next.js, PWA.',
  });
}
