'use client';
import { dateToTitle } from '@/lib/helpers/date';
import styles from './ActiveEntries.module.scss';

export default function ActiveEntries({ activeEntries }) {
  const filteredActive = activeEntries.filter((entry) => entry.title !== dateToTitle(new Date()));
  if (filteredActive.length === 0) return;

  return (
    <section className={styles.activeData}>
      <header>
        <h1>active entries</h1>
      </header>

      {filteredActive.map(({ id, title }) => (
        <div className={styles.activeEntry} key={id}>
          <h2>{title}</h2>
          <p>{id}</p>
        </div>
      ))}
    </section>
  );
}
