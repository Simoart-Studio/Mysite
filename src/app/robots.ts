import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  // wdrożenia preview: całkowity zakaz indeksowania (produkcja: normalne reguły + sitemapa)
  if (!INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
