'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { works } from '@/data/works';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fromLeftProps, diagonalProps } from '@/lib/motion';
import styles from './Works.module.scss';

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
        {/* header slides in from left */}
        <motion.header
          className={styles.header}
          {...fromLeftProps(isInView, reduced, 0)}
        >
          <p className={styles.label}>Realizacje</p>
          <h2 id="works-title" className={styles.headline}>Wybrane projekty</h2>
        </motion.header>

        <div className={styles.grid}>
          {works.map((work, i) => {
            const href  = work.caseStudy ? `/works/${work.slug}` : (work.liveUrl ?? '#');
            const isExt = !work.caseStudy && !!work.liveUrl;

            return (
              <motion.article
                key={work.slug}
                className={styles.card}
                /* diagonal: card 0 from left, card 1 from right */
                {...diagonalProps(isInView, reduced, i === 0 ? -1 : 1, 0.12 + i * 0.1)}
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
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.img}
                      preload={i === 0}
                    />
                  </div>
                  <footer className={styles.cardFooter}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardTag}>{work.role}</span>
                      <span className={styles.cardYear}>{work.year}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{work.title}</h3>
                  </footer>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
