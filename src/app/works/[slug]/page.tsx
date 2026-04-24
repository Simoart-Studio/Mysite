import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { works } from '@/data/works';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import styles from './page.module.scss';

type CaseStudyContent = {
  brief: string;
  concept: string;
  stackDetails: { name: string; role: string }[];
  highlights: { label: string; value: string }[];
};

const caseStudies: Record<string, CaseStudyContent> = {
  fancyshop: {
    brief:
      'Projekt portfolio front-end developera — kompletny sklep e-commerce zbudowany od zera. Cel: pokazać umiejętność budowania złożonych interfejsów z logiką biznesową: katalog, koszyk, checkout, wyszukiwarka.',
    concept:
      'Zaprojektowałem architekturę komponentów wokół React Context (koszyk, wishlist) i React Router (routing SPA). Animacje Framer Motion na przejściach między stronami i na UI mikro-interakcjach tworzą odczucie aplikacji produktowej, nie strony wizytówki. Skupiłem się na czytelnej hierarchii produktów i maksymalnym uproszczeniu ścieżki do zakupu.',
    stackDetails: [
      { name: 'React 18 + TypeScript',  role: 'component architecture, strict typing' },
      { name: 'React Router v6',        role: 'SPA routing, lazy loading stron' },
      { name: 'SCSS Modules',           role: 'custom design system, responsive grid' },
      { name: 'Framer Motion',          role: 'page transitions, UI animations' },
      { name: 'Context API + useReducer', role: 'koszyk, wishlist, globalny stan' },
      { name: 'Vite',                   role: 'bundler, HMR, build optimization' },
    ],
    highlights: [
      { label: 'Strony aplikacji',      value: '7+' },
      { label: 'Funkcje e-commerce',    value: 'Koszyk / Wishlist / Checkout' },
      { label: 'Architektura',          value: 'SPA + Context' },
      { label: 'Animacje',              value: 'Framer Motion' },
    ],
  },
  barberspace: {
    brief:
      'Premium salon barberski w stylu NYC potrzebował strony, która nie tylko prezentuje usługi, ale buduje brand — editorial aesthetic zgodny z pozycjonowaniem premium.',
    concept:
      'Zamiast standardowego layoutu „hero-usługi-kontakt" zaprojektowałem narrative flow: otwarcie filmowe, dramatyczna typografia, gallery inspirowana magazynami men\'s fashion. Każda sekcja buduje napięcie do finalnego CTA rezerwacji.',
    stackDetails: [
      { name: 'React 19 + TypeScript', role: 'component architecture' },
      { name: 'SCSS Modules', role: 'custom design system' },
      { name: 'Framer Motion', role: 'section transitions, scroll animations' },
      { name: 'useScrollReveal', role: 'IntersectionObserver-based reveal (custom hook)' },
      { name: 'EmailJS', role: 'formularz rezerwacji' },
      { name: 'JSON-LD Schema', role: 'local business SEO' },
      { name: 'Vercel', role: 'hosting + analytics' },
    ],
    highlights: [
      { label: 'PageSpeed Mobile', value: '98/100' },
      { label: 'Lighthouse Accessibility', value: '100/100' },
      { label: 'First Contentful Paint', value: '< 1s' },
      { label: 'Time to Interactive', value: '< 2s' },
    ],
  },
};

export async function generateStaticParams() {
  return works
    .filter((w) => w.caseStudy)
    .map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) return {};

  return {
    title: `${work.title} — Case Study`,
    description: work.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug && w.caseStudy);
  if (!work) notFound();

  const content = caseStudies[slug];
  if (!content) notFound();

  return (
    <>
      <NoiseOverlay />
      <Nav />
      <main id="main-content" className={styles.page}>
        {/* Hero */}
        <section className={styles.hero} aria-labelledby="cs-title">
          <div className={styles.heroInner}>
            <Link href="/" className={styles.back} aria-label="Wróć do wszystkich projektów">
              ← Wszystkie projekty
            </Link>
            <h1 id="cs-title" className={styles.title}>{work.title}</h1>
            <p className={styles.meta}>
              {work.year}
              <span aria-hidden="true"> · </span>
              {work.role}
              <span aria-hidden="true"> · </span>
              {work.stack.join(' · ')}
            </p>
          </div>
          <div className={styles.heroImage}>
            <Image
              src={work.thumbnail}
              alt={`Hero zrzut ekranu projektu ${work.title}`}
              width={1900}
              height={1024}
              sizes="(max-width: 768px) 100vw, 90vw"
              className={styles.heroImg}
              preload
            />
          </div>
        </section>

        {/* Brief */}
        <section className={styles.section} aria-label="Brief">
          <div className={styles.sectionInner}>
            <p className={styles.sectionLabel}>BRIEF</p>
            <p className={styles.sectionText}>{content.brief}</p>
          </div>
        </section>

        {/* Concept */}
        <section className={styles.section} aria-label="Concept">
          <div className={styles.sectionInner}>
            <p className={styles.sectionLabel}>CONCEPT</p>
            <p className={styles.sectionText}>{content.concept}</p>
          </div>
        </section>

        {/* Stack */}
        <section className={styles.section} aria-label="Stack techniczny">
          <div className={styles.sectionInner}>
            <p className={styles.sectionLabel}>STACK</p>
            <ul className={styles.stackList}>
              {content.stackDetails.map(({ name, role }) => (
                <li key={name} className={styles.stackItem}>
                  <span className={styles.stackName}>{name}</span>
                  <span className={styles.stackRole}>— {role}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Highlights */}
        <section className={styles.highlightsSection} aria-label="Wyniki projektu">
          <div className={styles.highlightsInner}>
            {content.highlights.map(({ label, value }) => (
              <div key={label} className={styles.highlight}>
                <span className={styles.highlightValue}>{value}</span>
                <span className={styles.highlightLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Live CTA */}
        {work.liveUrl && (
          <section className={styles.liveCta} aria-label="Link do projektu">
            <div className={styles.liveCtaInner}>
              <a
                href={work.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.liveCtaBtn}
                aria-label={`Otwórz ${work.title} na żywo (otwiera się w nowej karcie)`}
              >
                Zobacz na żywo →
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
