import Image from 'next/image';
import styles from './LogoPill.module.scss';

/**
 * Logo-naklejka w pigułce o wysokości przycisków (nawigacja 52 px, stopka większa).
 * To samo tło i obrys co pozostałe pigułki interfejsu; naklejka lekko przekrzywiona, z cieniem.
 */
export function LogoPill({ height = 52, priority, className }: { height?: number; priority?: boolean; className?: string }) {
  return (
    <span className={className ? `${styles.pill} ${className}` : styles.pill} style={{ '--h': `${height}px` } as React.CSSProperties}>
      <Image
        src="/logo-sticker.webp"
        alt=""
        width={444}
        height={239}
        priority={priority}
        sizes={`${Math.round(height * 1.6)}px`}
        className={styles.img}
      />
    </span>
  );
}
