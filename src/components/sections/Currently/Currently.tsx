'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, useMotionValue } from 'framer-motion';
import { Carousel } from '@/components/Carousel/Carousel';
import styles from './Currently.module.scss';

const EASE = [0.16, 1, 0.3, 1] as const;
const CURSOR_SIZE = 56;

const ITEMS = [
  {
    id: 'seo',
    label: '01 / Widoczność',
    value: 'Semantyka & SEO Techniczne',
    desc: 'Architektura informacji zoptymalizowana pod algorytmy Google i doświadczenia użytkownika.',
  },
  {
    id: 'ui',
    label: '02 / Interakcja',
    value: 'Kinetyczne Interfejsy',
    desc: 'Ruch, który nie jest ozdobą, lecz funkcjonalnym przewodnikiem po strukturze aplikacji.',
  },
  {
    id: 'arch',
    label: '03 / Standardy',
    value: 'Czysta Architektura',
    desc: 'Kod pisany z myślą o skalowalności, testowalności i bezproblemowej rozbudowie.',
  },
] as const;

const wordVariants = {
  hidden:  { opacity: 0, y: 12, filter: 'blur(6px)', scale: 0.92 },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', scale: 1    },
  exit:    { opacity: 0, y: -8, filter: 'blur(6px)', scale: 1.06 },
};

function AnimatedWords({
  text,
  delay = 0.07,
  className,
  Tag = 'span',
}: {
  text: string;
  delay?: number;
  className?: string;
  Tag?: 'span' | 'h3' | 'p';
}) {
  const words = text.split(' ');
  return (
    <Tag className={className}>
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          className={styles.word}
          variants={wordVariants}
          transition={{ duration: 0.38, delay: wi * delay, ease: EASE }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

export function Currently() {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [over, setOver]         = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      cursorX.set(e.clientX - CURSOR_SIZE / 2);
      cursorY.set(e.clientY - CURSOR_SIZE / 2);
    },
    [cursorX, cursorY],
  );

  const cursor = (
    <motion.div
      className={styles.openCursor}
      style={{ x: cursorX, y: cursorY }}
      animate={{ opacity: over ? 1 : 0 }}
      transition={{ duration: 0.18 }}
      aria-hidden="true"
    >
      <motion.div
        className={styles.openCursorPing}
        animate={{ scale: [1, 1.75], opacity: [1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
      />
      <div className={styles.openCursorRing}>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeId ? 'close' : 'open'}
            className={styles.openCursorLabel}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.16 }}
          >
            {activeId ? '✕' : 'OPEN'}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <section
      className={styles.section}
      ref={ref}
      aria-labelledby="currently-title"
      data-hide-cursor
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      {mounted && createPortal(cursor, document.body)}

      <header className={styles.header}>
        <p className={styles.headerLabel}>Specjalizacje</p>
        <h2 id="currently-title" className={styles.headerHeadline}>
          Co robię najlepiej
        </h2>
      </header>

      {/* Desktop 3-col grid */}
      <div className={styles.inner}>
        {ITEMS.map(({ id, label, value, desc }, i) => {
          const isOpen = activeId === id;
          return (
            <div
              key={id}
              className={`${styles.item} ${isOpen ? styles.isOpen : ''}`}
              onClick={() => setActiveId(isOpen ? null : id)}
            >
              <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
              >
                <span className={styles.label}>{label}</span>

                <div className={styles.swapArea}>
                  <AnimatePresence mode="wait">
                    {!isOpen ? (
                      <motion.h3
                        key="value"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={styles.value}
                      >
                        <AnimatedWords text={value} delay={0.07} />
                      </motion.h3>
                    ) : (
                      <motion.p
                        key="desc"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={styles.description}
                      >
                        <AnimatedWords text={desc} delay={0.03} />
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.footer}>
                  <span className={styles.hint}>
                    {isOpen ? 'Zamknij' : 'Eksploruj'}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mobile carousel */}
      <div className={styles.carouselWrap}>
        <Carousel label="Kompetencje">
          {ITEMS.map(({ id, label, value, desc }) => (
            <div
              key={id}
              className={styles.slideItem}
              onClick={() => setActiveId(activeId === id ? null : id)}
            >
              <p className={styles.label}>{label}</p>
              <p className={styles.value}>{value}</p>
              {activeId === id && (
                <p className={styles.description}>{desc}</p>
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
