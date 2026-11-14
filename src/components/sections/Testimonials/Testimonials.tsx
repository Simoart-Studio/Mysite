import { testimonials, type Testimonial } from '@/data/testimonials';
import styles from './Testimonials.module.scss';

export function Testimonials({ items = testimonials }: { items?: Testimonial[] }) {
  if (!items.length) return null;

  return (
    <section id="opinie" className={styles.section} aria-labelledby="testimonials-title">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <p className={styles.label}>Opinie</p>
          <h2 id="testimonials-title" className={styles.headline}>Co mówią klienci</h2>
        </header>
        <ul className={styles.list}>
          {items.map((t) => (
            <li key={t.author + t.quote.slice(0, 20)} className={styles.item} data-reveal>
              <figure className={styles.figure}>
                <blockquote className={styles.quote}>
                  <p>„{t.quote}”</p>
                </blockquote>
                <figcaption className={styles.caption}>
                  <span className={styles.author}>{t.author}</span>
                  <span className={styles.role}>{t.role}</span>
                  {t.url && (
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className={styles.source}>
                      Źródło opinii ↗
                    </a>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
