import { SITE_URL } from './metadata';

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Szymon Pochopień',
    jobTitle: 'Frontend Developer',
    url: SITE_URL,
    email: 'szymon.pochopien01@gmail.com',
    sameAs: [
      'https://linkedin.com/in/szymon-pochopien',
      'https://github.com/szymzyd',
    ],
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Frontend Development'],
  };
}
