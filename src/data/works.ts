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
    slug: 'fancyshop',
    title: 'FancyShop',
    year: '2024',
    role: 'Design & Development',
    description: 'Nowoczesny sklep e-commerce — lista produktów, koszyk, checkout, wyszukiwarka. Pełna responsywność i animacje Framer Motion.',
    stack: ['React', 'TypeScript', 'SCSS', 'Framer Motion', 'Vite', 'React Router'],
    thumbnail: '/works/fancyshop-thumb.png',
    liveUrl: 'https://github.com/kameleon1312/Fancyshop',
    featured: false,
    caseStudy: true,
  },
];
