import type { MetadataRoute } from 'next';
import { projects } from '@/lib/projects';
import { SITE_URL } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/works`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/works/${p.slug}`,
      lastModified: p.lastCommitAt ? new Date(p.lastCommitAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/polityka-prywatnosci`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
