import Deauth from '../Deauth';
import { getSession } from '@/lib/auth.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
import TodaysDaily from './TodaysDaily';
import ActiveEntries from './ActiveEntries';
import HomeFeed from './HomeFeed';
import styles from './Home.module.scss';
const { pool } = connectToDatabase();

export const metadata = {
  title: 'Home | Helios',
  description: 'Helios home',
};

export default async function Home() {
  const { travelerId } = await getSession();
  if (!travelerId) return <Deauth />;

  let activeEntries;
  let logs;
  const client = await pool.connect();
  try {
    const entryQuery = `
                        SELECT * FROM entry
                        WHERE status = 'active'
                        AND traveler_id = $1
                        ORDER BY created_at DESC;
                       `;
    activeEntries = (await client.query(entryQuery, [travelerId])).rows;
    const logQuery = `
                      SELECT * FROM log
                      WHERE traveler_id = $1
                      AND created_at >= date_trunc('month', current_date - interval '1 month')
                      AND created_at < date_trunc('month', current_date)
                      ORDER BY created_at DESC
                     `;
    logs = (await client.query(logQuery, [travelerId])).rows;
  } catch (error) {
    return <Deauth />;
  } finally {
    client.release();
  }

  return (
    <div className={styles.homeWrapper}>
      <TodaysDaily activeEntries={activeEntries} />
      <ActiveEntries activeEntries={activeEntries} />
      <HomeFeed logs={logs} />
    </div>
  );
}
