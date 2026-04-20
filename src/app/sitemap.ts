import type { MetadataRoute } from 'next';
import { works } from '@/data/works';
import { SITE_URL } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = works
    .filter((w) => w.caseStudy)
    .map((w) => ({
      url: `${SITE_URL}/works/${w.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    ...caseStudies,
  ];
}
