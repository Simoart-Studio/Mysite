import styles from './Marquee.module.scss';

const ITEMS = [
  'React',
  'TypeScript',
  'Next.js',
  'Framer Motion',
  'SCSS',
  'Performance',
  'Accessibility',
  'Design',
  'Polska',
] as const;

const SEPARATOR = '·';

export function Marquee() {
  const track = ITEMS.map((item, i) => (
    <span key={i} className={styles.item}>
      {item}
      <span className={styles.sep} aria-hidden="true">{SEPARATOR}</span>
    </span>
  ));

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.track}>
        {track}
        {track}
      </div>
    </div>
  );
}
