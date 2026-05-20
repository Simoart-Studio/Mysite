import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { works } from '@/data/works';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import { SmokeReveal } from '@/components/SmokeReveal/SmokeReveal';
import styles from './page.module.scss';

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

  const content = work.caseStudyContent;
  if (!content) notFound();

  return (
    <>
      <NoiseOverlay />
      <Nav />
      <main id="main-content" className={styles.page}>

        {/* Hero */}
        <section className={styles.hero} aria-labelledby="cs-title">
          <SmokeReveal>
            <div className={styles.heroInner}>
              <Link href="/" className={styles.back} aria-label="Wróć do wszystkich projektów">
                ← Wszystkie projekty
              </Link>
              <h1 id="cs-title" className={styles.title}>{work.title}</h1>
              <p className={styles.meta}>
                {work.year}
                <span aria-hidden="true"> · </span>
                {work.role}
              </p>
            </div>
          </SmokeReveal>
          <div className={styles.heroImage}>
            <SmokeReveal delay={0.15}>
              <Image
                src={work.thumbnail}
                alt={`Hero zrzut ekranu projektu ${work.title}`}
                width={1900}
                height={1024}
                sizes="(max-width: 768px) 100vw, 90vw"
                className={styles.heroImg}
                priority
              />
            </SmokeReveal>
          </div>
        </section>

        {/* Wyzwanie */}
        <section className={styles.challenge} aria-label="Wyzwanie">
          <SmokeReveal>
            <div className={styles.challengeInner}>
              <p className={styles.sectionLabel}>Wyzwanie</p>
              <p className={styles.challengeText}>{content.challenge}</p>
            </div>
          </SmokeReveal>
        </section>

        {/* Rozwiązanie */}
        <section className={styles.section} aria-label="Rozwiązanie">
          <SmokeReveal>
            <div className={styles.sectionInner}>
              <p className={styles.sectionLabel}>Rozwiązanie</p>
              <p className={styles.sectionText}>{content.solution}</p>
            </div>
          </SmokeReveal>
        </section>

        {/* Efekt */}
        <section className={styles.efekt} aria-label="Efekt">
          <SmokeReveal>
            <div className={styles.efektInner}>
              <div className={styles.efektHeader}>
                <p className={styles.sectionLabel}>Efekt</p>
                <p className={styles.efektText}>{content.result}</p>
              </div>
              <div className={styles.highlightsGrid}>
                {content.highlights.map(({ label, value }) => (
                  <div key={label} className={styles.highlight}>
                    <span className={styles.highlightValue}>{value}</span>
                    <span className={styles.highlightLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </SmokeReveal>
        </section>

        {/* Stack */}
        <section className={styles.section} aria-label="Stack techniczny">
          <SmokeReveal>
            <div className={styles.sectionInner}>
              <p className={styles.sectionLabel}>Stack</p>
              <ul className={styles.stackList}>
                {content.stackDetails.map(({ name, role }) => (
                  <li key={name} className={styles.stackItem}>
                    <span className={styles.stackName}>{name}</span>
                    <span className={styles.stackRole}>— {role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SmokeReveal>
        </section>

        {/* Live CTA */}
        {work.liveUrl && (
          <section className={styles.liveCta} aria-label="Link do projektu">
            <SmokeReveal>
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
            </SmokeReveal>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
