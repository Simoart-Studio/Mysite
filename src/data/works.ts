import type { Work } from '@/types';

export const works: Work[] = [
  {
    slug:        'barberspace',
    title:       'BarberSpace',
    year:        '2025',
    role:        'Design & Development',
    description: 'Strona sprzedażowa dla premium salonu fryzjerskiego. Styl NYC — każdy element prowadzi klienta prosto do rezerwacji.',
    stack:       ['Landing page', 'Rezerwacje online', 'Premium design', 'Mobile-first'],
    thumbnail:   '/works/barberspace-thumb.png',
    liveUrl:     'https://barber-space.vercel.app',
    featured:    true,
    caseStudy:   true,
    type:        'landing',
    caseStudyContent: {
      challenge:
        'Klient prowadził premium salon fryzjerski, gdzie rezerwacja działała tylko przez telefon. Brakowało strony, która oddawałaby charakter miejsca i zamieniała odwiedziny w konkretne umówienie wizyty.',
      solution:
        'Zaprojektowałem stronę opartą na narracji wizualnej — filmowe otwarcie, mocna typografia, galeria w stylu magazynów. Każda sekcja prowadzi do jednego miejsca: formularza rezerwacji. Strona działa błyskawicznie i wygląda dobrze na każdym urządzeniu.',
      result:
        'Klient może teraz przyjmować rezerwacje online bez odbierania telefonów. Strona ładuje się w mniej niż sekundę i trafia wysoko w wynikach Google dla lokalnych fraz. Nowi klienci trafiają na stronę i od razu wiedzą, czego mogą się spodziewać.',
      stackDetails: [
        { name: 'React 19 + TypeScript', role: 'architektura komponentów'                   },
        { name: 'SCSS Modules',          role: 'własny system designu'                       },
        { name: 'Framer Motion',         role: 'animacje przejść i scroll-reveal'            },
        { name: 'EmailJS',               role: 'formularz rezerwacji'                        },
        { name: 'JSON-LD Schema',        role: 'SEO dla lokalnego biznesu'                   },
        { name: 'Vercel',                role: 'hosting i analityka'                         },
      ],
      highlights: [
        { label: 'PageSpeed Mobile',     value: '98/100'  },
        { label: 'Dostępność (WCAG)',    value: '100/100' },
        { label: 'Pierwsze ładowanie',   value: '< 1s'    },
        { label: 'Gotowość do obsługi',  value: '< 2s'    },
      ],
    },
  },
  {
    slug:        'fancyshop',
    title:       'FancyShop',
    year:        '2024',
    role:        'Design & Development',
    description: 'Kompletny sklep internetowy z katalogiem produktów, koszykiem i płatnościami. Wygodne zakupy na każdym urządzeniu.',
    stack:       ['Sklep internetowy', 'Koszyk zakupowy', 'Wyszukiwarka produktów', 'Mobile-first'],
    thumbnail:   '/works/fancyshop-thumb.png',
    liveUrl:     'https://my-fancyshop.vercel.app/',
    featured:    false,
    caseStudy:   true,
    type:        'ecommerce',
    caseStudyContent: {
      challenge:
        'Celem było zbudowanie sklepu internetowego, który działa jak prawdziwa platforma sprzedażowa — z katalogiem, wyszukiwarką, koszykiem i realizacją zamówienia. Nie strona-wizytówka, ale gotowe narzędzie do sprzedaży.',
      solution:
        'Zbudowałem kompletny sklep od zera: przeglądanie produktów, filtrowanie, wishlist, koszyk z edycją ilości i checkout. Cała ścieżka zakupowa jest płynna — bez przeładowań strony. Przejścia między podstronami są animowane, co nadaje aplikacji charakter nowoczesnego produktu.',
      result:
        'Gotowa platforma sprzedażowa z siedmioma podstronami i pełną ścieżką zakupową. Klient widzi, że taki sklep naprawdę działa — od przeglądania po finalizację zamówienia. Całość ładuje się w półtorej sekundy.',
      stackDetails: [
        { name: 'React 18 + TypeScript',    role: 'architektura komponentów'            },
        { name: 'React Router v6',          role: 'routing i lazy loading'              },
        { name: 'SCSS Modules',             role: 'własny system designu'               },
        { name: 'Framer Motion',            role: 'animacje przejść i mikro-interakcje' },
        { name: 'Context API + useReducer', role: 'koszyk, wishlist, globalny stan'     },
        { name: 'Vite',                     role: 'build i optymalizacja'               },
      ],
      highlights: [
        { label: 'Podstrony sklepu',     value: '7+'      },
        { label: 'Czas ładowania',       value: '< 1.5s'  },
        { label: 'Ścieżka zakupowa',     value: '100%'    },
        { label: 'Obsługa urządzeń',     value: '✓ każde' },
      ],
    },
  },
];
