'use client';
import { useState, useEffect, useContext } from 'react';
import styles from './HomeFeed.module.scss';

export default function HomeFeed({ logs }) {
  const [feed, setFeed] = useState(logs);

  return (
    <>
      <section>
        <header>
          <h1>points this month.</h1>
        </header>

        <div className={styles.stats}>
          <div className={styles.visualizer}>
            <span>
              <p>words logged this month</p>
            </span>
          </div>

          <div className={styles.selector}>
            <p>month</p>
          </div>
        </div>
      </section>

      <section className={styles.feed}>
        <header>
          <h1>adventure log</h1>
        </header>

        {feed.map(({ id, action, type }) => (
          <div key={id} className={styles.log}>
            <span>
              <label>{type}</label>
              <p>{action}</p>
            </span>
          </div>
        ))}
      </section>
    </>
  );
}
