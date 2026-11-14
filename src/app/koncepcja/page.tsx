import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import { Field } from '@/components/concept/Field';
import { Hero } from '@/components/concept/Hero';
import { Workshop } from '@/components/concept/Workshop';
import { Gallery, type GalleryItem } from '@/components/concept/Gallery';
import { Marquee } from '@/components/concept/Marquee';
import { Details } from '@/components/concept/Details';
import { Finale } from '@/components/concept/Finale';
import styles from '@/components/concept/Concept.module.scss';

export const metadata: Metadata = {
  title: 'Koncepcja',
  robots: { index: false, follow: false },
};

const items: GalleryItem[] = projects.slice(0, 7).map((p) => ({
  slug: p.slug,
  name: p.name,
  kind: p.kind,
  desktop: p.screenshots.find((s) => s.device === 'desktop')?.src ?? p.thumbnail?.src ?? null,
  mobile: p.screenshots.find((s) => s.device === 'mobile')?.src ?? null,
}));

export default function ConceptPage() {
  return (
    <div className={styles.root} data-concept>
      <Field />

      <header className={styles.nav}>
        <Link href="/koncepcja" className={styles.logo} aria-label="SimoArt studio, początek strony">
          <Image src="/logo.webp" alt="" width={316} height={160} sizes="90px" priority />
        </Link>
        <a href="#kontakt" className={styles.contact}>Kontakt</a>
      </header>

      <main id="main-content" className={styles.main}>
        <Hero />
        <Workshop />
        <Gallery items={items} />
        <Marquee />
        <Details />
        <Finale />
      </main>
    </div>
  );
}
