'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { IoIosPartlySunny } from 'react-icons/io';
import { DailyContext } from '@/lib/context';
import { dateToTitle } from '@/lib/helpers/date';
import styles from './TodaysDaily.module.scss';

export default function TodaysDaily({ activeEntries }) {
  const { daily } = useContext(DailyContext);
  const [todaysDaily, setTodaysDaily] = useState({});

  useEffect(() => {
    let ssDaily = activeEntries.filter((entry) => entry.title === dateToTitle(new Date()))[0];
    setTodaysDaily(ssDaily ? ssDaily : daily);
  }, [activeEntries, daily, setTodaysDaily]);

  return Object.keys(todaysDaily).length === 0 ? (
    <section className={styles.callToCreate}>
      <span>
        <IoIosPartlySunny />
        <h1>no daily entry</h1>
      </span>

      <Link href='/write?v=daily'>create</Link>
    </section>
  ) : (
    <section className={styles.dailyStats}>
      <header>
        <h1>
          <span>Daily:</span> {todaysDaily?.title}
        </h1>
      </header>
    </section>
  );
}
