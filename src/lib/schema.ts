import type { Project } from '@/types/project';
import { BRAND, OWNER, EMAIL, PHONE, GITHUB_URL, LINKEDIN_URL } from '@/data/config';
import { SITE_URL, siteMetadata } from './metadata';

/* Usługi (te same, co w sekcji „Co chcesz zbudować?”) — katalog oferty dla wyszukiwarek */
const SERVICES = [
  { name: 'Strona firmowa', description: 'Strona, która w kilka sekund mówi, co robisz, i prowadzi do kontaktu.' },
  { name: 'Sklep internetowy', description: 'Sklep z prostą ścieżką zakupu, wygodny na telefonie.' },
  { name: 'Aplikacja webowa', description: 'Powtarzalny proces zamieniony w prostą aplikację w przeglądarce.' },
  { name: 'Aplikacja mobilna (PWA)', description: 'Aplikacja instalowana z przeglądarki, działająca offline.' },
  { name: 'MVP lub prototyp', description: 'Najmniejsza wersja produktu do sprawdzenia na prawdziwych użytkownikach.' },
] as const;

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID    = `${SITE_URL}/#organization`;

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: BRAND,
        url: SITE_URL,
        description: siteMetadata.description,
        logo: `${SITE_URL}/logo.png`,
        email: EMAIL,
        ...(PHONE ? { telephone: PHONE } : {}),
        founder: { '@id': PERSON_ID },
        areaServed: { '@type': 'Country', name: 'Polska' },
        knowsLanguage: 'pl',
        sameAs: [GITHUB_URL, LINKEDIN_URL],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Usługi',
          itemListElement: SERVICES.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.name, description: s.description, provider: { '@id': ORG_ID } },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: OWNER,
        jobTitle: 'Projektant i developer stron oraz aplikacji',
        worksFor: { '@id': ORG_ID },
        url: SITE_URL,
        email: EMAIL,
        sameAs: [GITHUB_URL, LINKEDIN_URL],
        knowsAbout: ['React', 'Next.js', 'TypeScript', 'PWA', 'Projektowanie stron internetowych'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND,
        inLanguage: 'pl-PL',
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

export function buildProjectSchema(p: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/works/${p.slug}#work`,
    name: p.name,
    url: `${SITE_URL}/works/${p.slug}`,
    ...(p.tagline ? { description: p.tagline } : {}),
    ...(p.thumbnail ? { image: `${SITE_URL}${p.thumbnail.src}` } : {}),
    ...(p.createdAt ? { dateCreated: p.createdAt } : {}),
    ...(p.lastCommitAt ? { dateModified: p.lastCommitAt } : {}),
    ...(p.demoUrl ? { sameAs: [p.demoUrl, ...(p.repoUrl ? [p.repoUrl] : [])] } : {}),
    keywords: [...p.stack, ...p.topics].join(', '),
    inLanguage: 'pl-PL',
    creator: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
  };
}

export function buildProjectsListSchema(projects: Project[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Projekty ${BRAND}`,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: buildProjectSchema(p),
    })),
  };
}
