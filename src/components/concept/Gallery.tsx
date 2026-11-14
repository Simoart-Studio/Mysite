'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { dice } from './palette';
import { prefersReducedMotion, useScrollProgress } from './useScrollProgress';
import styles from './Gallery.module.scss';

export type GalleryItem = {
  slug: string;
  name: string;
  kind: string | null;
  desktop: string | null;
  mobile: string | null;
};

/**
 * Projekty: przewijanie w dół przesuwa pas w bok. Zrzut odsłania się, gdy wjeżdża,
 * telefon płynie szybciej niż ekran (paralaksa), licznik pokazuje bieżący projekt.
 */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const still = useRef(false);

  // Wysokość sekcji = długość pasa: przewinięcie o 1 px w dół przesuwa pas o 1 px w bok.
  useEffect(() => {
    const sec = ref.current;
    const tr = track.current;
    if (!sec || !tr) return;
    if (prefersReducedMotion()) {
      still.current = true;
      sec.classList.add(styles.static!);
      return;
    }
    const size = () => {
      sec.style.height = `${tr.scrollWidth - window.innerWidth + window.innerHeight}px`;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(tr);
    window.addEventListener('resize', size);
    return () => { ro.disconnect(); window.removeEventListener('resize', size); };
  }, []);

  const onFrame = useCallback((p: number) => {
    const tr = track.current;
    if (!tr || still.current) return;
    const vw = window.innerWidth;
    tr.style.transform = `translate3d(${(-p * Math.max(0, tr.scrollWidth - vw)).toFixed(1)}px,0,0)`;
    let best = 0, bestD = Infinity;
    tr.querySelectorAll<HTMLElement>('[data-panel]').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const e = (r.left + r.width / 2 - vw / 2) / vw;
      el.style.setProperty('--e', e.toFixed(3));
      if (Math.abs(e) < bestD) { bestD = Math.abs(e); best = i; }
    });
    if (counter.current) counter.current.textContent = String(best + 1).padStart(2, '0');
  }, []);
  useScrollProgress(ref, 'pin', onFrame);

  const total = String(items.length).padStart(2, '0');

  return (
    <section ref={ref} id="projekty" className={styles.section} aria-labelledby="gallery-title">
      <div className={styles.sticky}>
        <div ref={track} className={styles.track}>
          {items.map((it, i) => (
            <Link
              key={it.slug}
              href={`/works/${it.slug}`}
              data-panel
              className={styles.panel}
              style={{ '--c': dice(i) } as React.CSSProperties}
            >
              <span className={styles.idx} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.shot}>
                {it.desktop && (
                  // eslint-disable-next-line @next/next/no-img-element -- zrzuty są już zoptymalizowane (webp), a pas przesuwa się transformacją
                  <img src={it.desktop} alt="" loading={i < 2 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
                )}
              </span>
              {it.mobile && (
                <span className={styles.phone} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element -- jw. */}
                  <img src={it.mobile} alt="" loading="lazy" decoding="async" draggable={false} />
                </span>
              )}
              <span className={styles.info}>
                <span className={styles.name}>{it.name}</span>
                {it.kind && <span className={styles.kind}>{it.kind}</span>}
                <ArrowUpRight className={styles.arrow} size={22} strokeWidth={1.6} aria-hidden="true" />
              </span>
            </Link>
          ))}

          <Link href="/works" data-panel className={styles.all}>
            <span className={styles.allCircle}><ArrowUpRight size={34} strokeWidth={1.4} aria-hidden="true" /></span>
            <span>Wszystkie projekty</span>
          </Link>
        </div>

        <div className={styles.head}>
          <h2 id="gallery-title" className={styles.label}><span>02</span> Projekty</h2>
          <span className={styles.progress} aria-hidden="true"><i /></span>
          <p className={styles.count} aria-hidden="true"><span ref={counter}>01</span> / {total}</p>
        </div>

      </div>
    </section>
  );
}
