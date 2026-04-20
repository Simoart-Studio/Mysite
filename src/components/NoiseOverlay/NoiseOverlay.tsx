'use client';

import styles from './NoiseOverlay.module.scss';

export function NoiseOverlay() {
  return (
    <div aria-hidden="true" className={styles.noise}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" opacity="0.4" />
      </svg>
    </div>
  );
}
