'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { works } from '@/data/works';
import type { WorkType } from '@/types';
import { GITHUB_URL } from '@/data/config';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fromLeftProps, revealProps } from '@/lib/motion';
import { Carousel } from '@/components/Carousel/Carousel';
import styles from './Works.module.scss';

const TILE_COLS = 4;
const TILE_ROWS = 3;
const TILES = Array.from({ length: TILE_COLS * TILE_ROWS }, (_, i) => i);
const E_WAVE = [0.76, 0, 0.24, 1] as const;

/* ─── Stack badge styles — static objects, no allocation per render ─── */
const BADGE_STYLES: Record<string, React.CSSProperties> = {
  'React':                   { backgroundColor: 'rgba(97,218,251,0.12)',  color: 'rgba(97,218,251,0.65)',  borderColor: 'rgba(97,218,251,0.12)'  },
  'TypeScript':              { backgroundColor: 'rgba(49,120,198,0.14)',  color: 'rgba(49,120,198,0.80)',  borderColor: 'rgba(49,120,198,0.14)'  },
  'Next.js':                 { backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.07)' },
  'SCSS':                    { backgroundColor: 'rgba(205,102,153,0.12)', color: 'rgba(205,102,153,0.75)', borderColor: 'rgba(205,102,153,0.12)' },
  'Framer Motion':           { backgroundColor: 'rgba(255,0,128,0.10)',   color: 'rgba(255,80,140,0.70)',  borderColor: 'rgba(255,0,128,0.10)'   },
  'Node.js':                 { backgroundColor: 'rgba(104,160,99,0.12)',  color: 'rgba(104,160,99,0.75)',  borderColor: 'rgba(104,160,99,0.12)'  },
  'Vite':                    { backgroundColor: 'rgba(100,108,255,0.12)', color: 'rgba(130,138,255,0.75)', borderColor: 'rgba(100,108,255,0.12)' },
  'React Router':            { backgroundColor: 'rgba(202,67,35,0.12)',   color: 'rgba(202,67,35,0.75)',   borderColor: 'rgba(202,67,35,0.12)'   },
  'EmailJS':                 { backgroundColor: 'rgba(255,107,107,0.10)', color: 'rgba(255,107,107,0.70)', borderColor: 'rgba(255,107,107,0.10)' },
  'Context API + useReducer':{ backgroundColor: 'rgba(97,218,251,0.09)',  color: 'rgba(97,218,251,0.55)',  borderColor: 'rgba(97,218,251,0.09)'  },
};

/* ─── Filter config ─── */
type Filter = 'all' | WorkType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',       label: 'Wszystkie' },
  { key: 'landing',   label: 'Landing'   },
  { key: 'ecommerce', label: 'E-commerce'},
  { key: 'app',       label: 'Aplikacja' },
];

function ParallaxCardImg({
  src, alt, sizes, priority, reduced,
}: {
  src: string; alt: string; sizes: string; priority?: boolean; reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%']);

  return (
    <div ref={ref} className={styles.parallaxClip}>
      <motion.div className={styles.parallaxInner} style={{ y }}>
        <Image
          src={src} alt={alt} width={1900} height={1024}
          sizes={sizes} className={styles.img} priority={priority}
        />
      </motion.div>
    </div>
  );
}

function DesktopCard({
  work, index, reduced,
}: {
  work: (typeof works)[number]; index: number; reduced: boolean;
}) {
  const href  = work.caseStudy ? `/works/${work.slug}` : (work.liveUrl ?? '#');
  const isExt = !work.caseStudy && !!work.liveUrl;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: E_WAVE }}
    >
      <Link
        href={href}
        className={styles.cardLink}
        target={isExt ? '_blank' : undefined}
        rel={isExt ? 'noopener noreferrer' : undefined}
        aria-label={`${work.title} — ${work.role}, ${work.year}`}
      >
        <div className={styles.imgWrap}>
          <ParallaxCardImg
            src={work.thumbnail} alt={`Projekt ${work.title}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0} reduced={reduced}
          />
          <span className={styles.glint} aria-hidden="true" />

          {!reduced && (
            <motion.div
              className={styles.tileGrid}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              aria-hidden="true"
            >
              {TILES.map((idx) => {
                const col = idx % TILE_COLS;
                const row = Math.floor(idx / TILE_COLS);
                return (
                  <motion.span
                    key={idx} className={styles.tile}
                    variants={{
                      hidden:   { scaleY: 1 },
                      visible:  { scaleY: 0, transition: { duration: 0.38, delay: (col + row) * 0.07, ease: E_WAVE } },
                    }}
                    style={{ transformOrigin: 'top' }}
                  />
                );
              })}
            </motion.div>
          )}

          <div className={styles.imgOverlay} aria-hidden="true">
            <span className={styles.openLabel}>
              {work.caseStudy ? 'Case study →' : 'Otwórz projekt ↗'}
            </span>
          </div>
        </div>

        <footer className={styles.cardFooter}>
          <div className={styles.cardMeta}>
            <span className={styles.cardTag}>{work.role}</span>
            <span className={styles.cardYear}>{work.year}</span>
          </div>
          <h3 className={styles.cardTitle}>{work.title}</h3>
          <p className={styles.cardDesc}>{work.description}</p>
          <ul className={styles.stack} aria-label="Technologie">
            {work.stack.map((t) => (
              <li key={t} className={styles.stackBadge} style={BADGE_STYLES[t]}>{t}</li>
            ))}
          </ul>
        </footer>
      </Link>
    </motion.article>
  );
}

export function Works() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = !!useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all'
    ? works
    : works.filter((w) => w.type === filter);

  const hasType = (key: Filter) =>
    key === 'all' || works.some((w) => w.type === key);

  return (
    <section
      id="works"
      className={`${styles.section} section-light`}
      ref={ref}
      aria-labelledby="works-title"
    >
      <div className={styles.inner}>
        {/* header */}
        <motion.header
          className={styles.header}
          {...fromLeftProps(isInView, reduced, 0)}
        >
          <div className={styles.headerRow}>
            <p className={styles.label}>Realizacje</p>
            <span className={styles.count} aria-hidden="true">
              {works.length.toString().padStart(2, '0')}
            </span>
          </div>
          <h2 id="works-title" className={styles.headline}>Wybrane projekty</h2>
        </motion.header>

        {/* filter row */}
        <div className={styles.filters} role="group" aria-label="Filtruj projekty">
          {FILTERS.filter(({ key }) => hasType(key)).map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className={styles.carouselWrap}>
          <Carousel label="Projekty">
            {filtered.map((work) => {
              const href  = work.caseStudy ? `/works/${work.slug}` : (work.liveUrl ?? '#');
              const isExt = !work.caseStudy && !!work.liveUrl;
              return (
                <motion.article
                  key={work.slug}
                  className={styles.card}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link
                    href={href}
                    className={styles.cardLink}
                    target={isExt ? '_blank' : undefined}
                    rel={isExt ? 'noopener noreferrer' : undefined}
                    aria-label={`${work.title} — ${work.role}, ${work.year}`}
                  >
                    <div className={styles.imgWrap}>
                      <Image
                        src={work.thumbnail} alt={`Projekt ${work.title}`}
                        width={1900} height={1024} sizes="100vw" className={styles.img}
                      />
                    </div>
                    <footer className={styles.cardFooter}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardTag}>{work.role}</span>
                        <span className={styles.cardYear}>{work.year}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{work.title}</h3>
                      <p className={styles.cardDesc}>{work.description}</p>
                      <ul className={styles.stack} aria-label="Technologie">
                        {work.stack.map((t) => (
                          <li key={t} className={styles.stackBadge} style={BADGE_STYLES[t]}>{t}</li>
                        ))}
                      </ul>
                    </footer>
                  </Link>
                </motion.article>
              );
            })}
          </Carousel>
        </div>

        {/* Desktop grid */}
        <div className={styles.grid}>
          {filtered.map((work, i) => (
            <DesktopCard key={work.slug} work={work} index={i} reduced={reduced} />
          ))}
        </div>

        {/* footer link */}
        <motion.div
          className={styles.footer}
          {...revealProps(isInView, reduced, 0.35)}
        >
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Więcej projektów na GitHub ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
