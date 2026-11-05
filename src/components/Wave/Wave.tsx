import styles from './Wave.module.scss';

const SHAPES = [
  ['M0,64 C240,8 480,8 720,48 C960,88 1200,104 1440,56 L1440,120 L0,120 Z',
   'M0,88 C260,40 520,36 760,70 C1000,104 1240,96 1440,72 L1440,120 L0,120 Z'],
  ['M0,40 C300,96 600,104 900,64 C1140,32 1320,28 1440,44 L1440,120 L0,120 Z',
   'M0,72 C280,112 620,110 920,84 C1160,62 1320,58 1440,70 L1440,120 L0,120 Z'],
  ['M0,80 C200,40 420,24 660,52 C900,80 1180,112 1440,64 L1440,120 L0,120 Z',
   'M0,96 C220,64 460,56 700,78 C940,100 1200,110 1440,86 L1440,120 L0,120 Z'],
];

/** Organiczne przejście między sekcjami: tło `from`, fala w kolorze `to`. */
export function Wave({ from, to, shape = 0 }: { from: string; to: string; shape?: 0 | 1 | 2 }) {
  const [back, front] = SHAPES[shape]!;
  return (
    <div className={styles.wave} style={{ ['--from' as string]: from, ['--to' as string]: to }} aria-hidden="true">
      <svg className={styles.back} viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={back} /></svg>
      <svg className={styles.front} viewBox="0 0 1440 120" preserveAspectRatio="none"><path d={front} /></svg>
    </div>
  );
}
