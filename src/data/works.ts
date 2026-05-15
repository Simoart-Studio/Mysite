import type { Work } from '@/types';

export const works: Work[] = [
  {
    slug:        'barberspace',
    title:       'BarberSpace',
    year:        '2025',
    role:        'Design & Development',
    description: 'Editorial landing page dla premium salonu barberskiego. Styl NYC, focus na konwersję rezerwacji.',
    stack:       ['React', 'TypeScript', 'SCSS', 'Framer Motion', 'EmailJS'],
    thumbnail:   '/works/barberspace-thumb.png',
    liveUrl:     'https://barber-space.vercel.app',
    featured:    true,
    caseStudy:   true,
    type:        'landing',
    caseStudyContent: {
      brief:
        'Premium salon barberski w stylu NYC potrzebował strony, która nie tylko prezentuje usługi, ale buduje brand — editorial aesthetic zgodny z pozycjonowaniem premium.',
      concept:
        'Zamiast standardowego layoutu „hero-usługi-kontakt" zaprojektowałem narrative flow: otwarcie filmowe, dramatyczna typografia, gallery inspirowana magazynami men\'s fashion. Każda sekcja buduje napięcie do finalnego CTA rezerwacji.',
      stackDetails: [
        { name: 'React 19 + TypeScript', role: 'component architecture'                            },
        { name: 'SCSS Modules',          role: 'custom design system'                              },
        { name: 'Framer Motion',         role: 'section transitions, scroll animations'            },
        { name: 'useScrollReveal',       role: 'IntersectionObserver-based reveal (custom hook)'   },
        { name: 'EmailJS',               role: 'formularz rezerwacji'                              },
        { name: 'JSON-LD Schema',        role: 'local business SEO'                                },
        { name: 'Vercel',                role: 'hosting + analytics'                               },
      ],
      highlights: [
        { label: 'PageSpeed Mobile',          value: '98/100' },
        { label: 'Lighthouse Accessibility',  value: '100/100' },
        { label: 'First Contentful Paint',    value: '< 1s'   },
        { label: 'Time to Interactive',       value: '< 2s'   },
      ],
    },
  },
  {
    slug:        'fancyshop',
    title:       'FancyShop',
    year:        '2024',
    role:        'Design & Development',
    description: 'Nowoczesny sklep e-commerce — lista produktów, koszyk, checkout, wyszukiwarka. Pełna responsywność i animacje Framer Motion.',
    stack:       ['React', 'TypeScript', 'SCSS', 'Framer Motion', 'Vite', 'React Router'],
    thumbnail:   '/works/fancyshop-thumb.png',
    liveUrl:     'https://my-fancyshop.vercel.app/',
    featured:    false,
    caseStudy:   true,
    type:        'ecommerce',
    caseStudyContent: {
      brief:
        'Projekt portfolio front-end developera — kompletny sklep e-commerce zbudowany od zera. Cel: pokazać umiejętność budowania złożonych interfejsów z logiką biznesową: katalog, koszyk, checkout, wyszukiwarka.',
      concept:
        'Zaprojektowałem architekturę komponentów wokół React Context (koszyk, wishlist) i React Router (routing SPA). Animacje Framer Motion na przejściach między stronami i na UI mikro-interakcjach tworzą odczucie aplikacji produktowej, nie strony wizytówki. Skupiłem się na czytelnej hierarchii produktów i maksymalnym uproszczeniu ścieżki do zakupu.',
      stackDetails: [
        { name: 'React 18 + TypeScript',      role: 'component architecture, strict typing'  },
        { name: 'React Router v6',            role: 'SPA routing, lazy loading stron'        },
        { name: 'SCSS Modules',               role: 'custom design system, responsive grid'  },
        { name: 'Framer Motion',              role: 'page transitions, UI animations'        },
        { name: 'Context API + useReducer',   role: 'koszyk, wishlist, globalny stan'        },
        { name: 'Vite',                       role: 'bundler, HMR, build optimization'       },
      ],
      highlights: [
        { label: 'Strony aplikacji',    value: '7+'                         },
        { label: 'Funkcje e-commerce',  value: 'Koszyk / Wishlist / Checkout' },
        { label: 'Architektura',        value: 'SPA + Context'              },
        { label: 'Animacje',            value: 'Framer Motion'              },
      ],
    },
  },
];
