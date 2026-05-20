'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AVAILABILITY } from '@/data/config';
import styles from './Hero.module.scss';

const EASE = [0.16, 1, 0.3, 1] as const;

function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function DustLine({
  text,
  delay,
  reduced,
  mounted,
}: {
  text: string;
  delay: number;
  reduced: boolean | null;
  mounted: boolean;
}) {
  if (reduced || !mounted) return <>{text}</>;

  return (
    <>
      {text.split('').map((char, i) => {
        const rx = sr(i * 3);
        const ry = sr(i * 3 + 1);
        const rs = sr(i * 3 + 2);
        return (
          <motion.span
            key={i}
            style={{ display: 'inline-block' }}
            initial={{
              opacity: 0,
              x: (rx - 0.5) * 100,
              y: (ry - 0.5) * 70,
              filter: 'blur(14px)',
              scale: 0.3 + rs * 1.1,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
            }}
            transition={{
              duration: 1.1,
              delay: delay + i * 0.038,
              ease: EASE,
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        );
      })}
    </>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 60) setScrolled(true); };
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-h1">
      <div className={styles.inner}>
        <motion.p
          className={styles.label}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <span className="sr-only">Rola: </span>
          Digital Developer&ensp;·&ensp;Self Made
        </motion.p>

        <h1 id="hero-h1" className={styles.h1}>
          <span className={styles.dustLine} aria-hidden="true">
            <DustLine text="Good Site" delay={0.2} reduced={reduced} mounted={mounted} />
          </span>
          <span className={styles.dustLine} aria-hidden="true">
            <DustLine text="Better Life." delay={0.62} reduced={reduced} mounted={mounted} />
          </span>
          <span className="sr-only">Good Site Better Life.</span>
        </h1>

        <motion.p
          className={styles.lead}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.7, ease: EASE, delay: 1.2 }}
        >
          Projektuję i buduję cyfrowe produkty, które zarabiają — nie tylko wyglądają.
        </motion.p>

        <motion.div
          className={styles.bottom}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.6, ease: EASE, delay: 1.45 }}
        >
          <span className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            <span className="sr-only">Status: </span>
            Dostępny {AVAILABILITY}
          </span>
        </motion.div>

        {!reduced && (
          <motion.div
            className={styles.scrollHint}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.6, delay: scrolled ? 0 : 2.2, ease: EASE }}
          >
            <span className={styles.scrollHintLine} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
