'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useOverlay } from '@/context/OverlayContext';
import { scrollToTarget } from '@/lib/scrollLock';
import { EMAIL, PHONE, phoneHref } from '@/data/config';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './MenuOverlay.module.scss';

const ITEMS = [
  { id: 'works',   label: 'Projekty'   },
  { id: 'uslugi',  label: 'Usługi'     },
  { id: 'process', label: 'Współpraca' },
  { id: 'about',   label: 'O mnie'     },
] as const;

export function MenuOverlay() {
  const { overlay, close, openContact } = useOverlay();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = overlay === 'menu';

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a,button')?.focus(), 60);
    return () => clearTimeout(t);
  }, [isOpen]);

  function go(e: React.MouseEvent, id: string) {
    if (!document.getElementById(id)) return;
    e.preventDefault();
    close();
    setTimeout(() => scrollToTarget(id, !!reduced), 40);
  }

  function trap(e: React.KeyboardEvent) {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>('a,button')];
    const first = items[0], last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="menu-backdrop"
          className={styles.backdrop}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          aria-hidden="true"
        />
      )}
      {isOpen && (
        <m.div
          key="menu-panel"
          ref={panelRef}
          id="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={styles.panel}
          onKeyDown={trap}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: reduced ? 0.1 : 0.32, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <nav aria-label="Menu główne">
            <ul className={styles.list}>
              {ITEMS.map((item, i) => (
                <m.li
                  key={item.id}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : 0.05 + i * 0.04, duration: 0.3 }}
                >
                  <a href={`/#${item.id}`} className={styles.item} onClick={(e) => go(e, item.id)}>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.icon} aria-hidden="true"><ArrowUpRight size={16} /></span>
                  </a>
                </m.li>
              ))}
            </ul>
          </nav>

          <button type="button" className={`btn ${styles.cta}`} onClick={() => openContact()}>
            Porozmawiajmy
            <BtnIcon />
          </button>

          <p className={styles.contact}>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            {PHONE && <a href={phoneHref(PHONE)}>{PHONE}</a>}
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
