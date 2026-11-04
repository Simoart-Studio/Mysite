import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects, getProject, TODO } from '@/lib/projects';
import { pageMetadata } from '@/lib/metadata';
import { buildProjectSchema, jsonLd } from '@/lib/schema';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { CaseStudyBody } from '@/components/ProjectDeck/CaseStudyBody';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import styles from './page.module.scss';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name}: studium przypadku`,
    description: p.tagline
      ? `${p.tagline} Problem, rozwiązanie, zakres prac i technologie projektu ${p.name}.`
      : `Projekt ${p.name}: status ${p.status.toLowerCase()}, technologie ${p.stack.join(', ')}. Opis w przygotowaniu.`,
    path: `/works/${p.slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.indexOf(p);
  const prev = projects[(idx - 1 + projects.length) % projects.length]!;
  const next = projects[(idx + 1) % projects.length]!;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildProjectSchema(p)) }}
      />
      <Nav />
      <main id="main-content" className={styles.page}>
        <header className={styles.hero}>
          <nav aria-label="Okruszki" className={styles.crumbs}>
            <Link href="/#works">← Wszystkie projekty</Link>
          </nav>
          <div className={styles.metaRow}>
            <span className={styles.status}>{p.status}</span>
            {p.labels.map((l) => <span key={l} className={styles.tag}>{l}</span>)}
          </div>
          <h1 className={styles.title}>{p.name}</h1>
          <p className={styles.tagline}>{p.tagline ?? <span className={styles.todo}>Opis problemu: {TODO.toLowerCase()}</span>}</p>
        </header>

        {p.screenshots.length > 0 ? (
          <section className={styles.gallery} aria-label="Zrzuty ekranu">
            {p.screenshots.map((s, i) => (
              <a
                key={s.src}
                href={s.src}
                className={s.device === 'mobile' ? styles.shotMobile : styles.shotDesktop}
                target="_blank"
                rel="noopener"
              >
                <Image
                  src={s.src}
                  alt={s.alt ?? `${p.name}, zrzut ${i + 1}`}
                  width={s.width}
                  height={s.height}
                  sizes={s.device === 'mobile' ? '(max-width: 768px) 50vw, 300px' : '(max-width: 768px) 100vw, 900px'}
                  priority={i === 0}
                  className={styles.shotImg}
                />
                <span className="sr-only"> (otwórz w pełnym rozmiarze)</span>
              </a>
            ))}
          </section>
        ) : (
          <p className={styles.noShots}><span className={styles.todo}>Zrzuty ekranu: {TODO.toLowerCase()}</span></p>
        )}

        <article className={styles.body}>
          <CaseStudyBody project={p} heading="h2" />
        </article>

        <aside className={styles.cta}>
          <p>Masz podobny problem do rozwiązania?</p>
          <ContactTrigger className={styles.ctaBtn}>Porozmawiajmy →</ContactTrigger>
        </aside>

        <nav className={styles.pager} aria-label="Inne projekty">
          <Link href={`/works/${prev.slug}`} className={styles.pagerLink}>
            <span className={styles.pagerLabel}>Poprzedni projekt</span>
            ← {prev.name}
          </Link>
          <Link href={`/works/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
            <span className={styles.pagerLabel}>Następny projekt</span>
            {next.name} →
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
