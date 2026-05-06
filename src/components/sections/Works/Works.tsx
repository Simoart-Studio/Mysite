'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { works } from '@/data/works';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fromLeftProps, revealProps } from '@/lib/motion';
import { Carousel } from '@/components/Carousel/Carousel';
import styles from './Works.module.scss';

const TILE_COLS = 4;
const TILE_ROWS = 3;
const TILES = Array.from({ length: TILE_COLS * TILE_ROWS }, (_, i) => i);
const E_WAVE = [0.76, 0, 0.24, 1] as const;

export function Works() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();

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

        {/* Mobile carousel */}
        <div className={styles.carouselWrap}>
          <Carousel label="Projekty">
            {works.map((work) => {
              const href  = work.caseStudy ? `/works/${work.slug}` : (work.liveUrl ?? '#');
              const isExt = !work.caseStudy && !!work.liveUrl;
              return (
                <article key={work.slug} className={styles.card}>
                  <Link
                    href={href}
                    className={styles.cardLink}
                    target={isExt ? '_blank' : undefined}
                    rel={isExt ? 'noopener noreferrer' : undefined}
                    aria-label={`${work.title} — ${work.role}, ${work.year}`}
                  >
                    <div className={styles.imgWrap}>
                      <Image
                        src={work.thumbnail}
                        alt={`Projekt ${work.title}`}
                        width={1900}
                        height={1024}
                        sizes="100vw"
                        className={styles.img}
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
                          <li key={t} className={styles.stackBadge}>{t}</li>
                        ))}
                      </ul>
                    </footer>
                  </Link>
                </article>
              );
            })}
          </Carousel>
        </div>

        {/* Desktop grid */}
        <div className={styles.grid}>
          {works.map((work, i) => {
            const href  = work.caseStudy ? `/works/${work.slug}` : (work.liveUrl ?? '#');
            const isExt = !work.caseStudy && !!work.liveUrl;

            return (
              <motion.article
                key={work.slug}
                className={styles.card}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: E_WAVE }}
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
                      src={work.thumbnail}
                      alt={`Projekt ${work.title}`}
                      width={1900}
                      height={1024}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.img}
                      priority={i === 0}
                    />
                    <span className={styles.glint} aria-hidden="true" />

                    {/* mosaic tile reveal */}
                    {!reduced && (
                      <motion.div
                        className={styles.tileGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        aria-hidden="true"
                      >
                        {TILES.map((idx) => {
                          const col = idx % TILE_COLS;
                          const row = Math.floor(idx / TILE_COLS);
                          return (
                            <motion.span
                              key={idx}
                              className={styles.tile}
                              variants={{
                                hidden: { scaleY: 1 },
                                visible: {
                                  scaleY: 0,
                                  transition: {
                                    duration: 0.38,
                                    delay: (col + row) * 0.07,
                                    ease: E_WAVE,
                                  },
                                },
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
                        <li key={t} className={styles.stackBadge}>{t}</li>
                      ))}
                    </ul>
                  </footer>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* footer link */}
        <motion.div
          className={styles.footer}
          {...revealProps(isInView, reduced, 0.35)}
        >
          <a
            href="https://github.com/kameleon1312"
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
