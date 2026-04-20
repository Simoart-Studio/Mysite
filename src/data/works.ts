import type { Work } from '@/types';

export const works: Work[] = [
  {
    slug: 'barberspace',
    title: 'BarberSpace',
    year: '2025',
    role: 'Design & Development',
    description: 'Editorial landing page dla premium salonu barberskiego. Styl NYC, focus na konwersję rezerwacji.',
    stack: ['React', 'TypeScript', 'SCSS', 'Framer Motion', 'EmailJS'],
    thumbnail: '/works/barberspace-thumb.webp',
    liveUrl: 'https://barber-space.vercel.app',
    featured: true,
    caseStudy: true,
  },
  {
    slug: 'taskiner',
    title: 'Taskiner',
    year: '2024',
    role: 'Design & Development',
    description: 'Aplikacja do zarządzania zadaniami z drag-and-drop i trybem focus.',
    stack: ['React', 'TypeScript', 'Zustand', 'DnD Kit', 'Framer Motion'],
    thumbnail: '/works/taskiner-thumb.webp',
    liveUrl: 'https://taskiner.vercel.app',
    featured: false,
    caseStudy: false,
  },
];
