import Link from 'next/link';
import { cookies } from 'next/headers';
import { MdPersonOutline } from 'react-icons/md';
import { AppNav, HeaderWriteButton, MobileAppNav, PageName } from './AppLayoutClientComponents';
import Deauth from './Deauth';
import { ContextProvider } from '@/lib/context';
import redis from '@/lib/config/redis.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
import styles from './layout.module.scss';

const { pool } = connectToDatabase();

export default async function AppLayout({ children }) {
  const heliosAuth = cookies().get('heliosAuth');
  if (!heliosAuth) return <Deauth />;
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth.value}`, 'travelerId');
  if (!travelerId) return <Deauth />;

  const client = await pool.connect();
  const sessionQuery = `
                  SELECT
                    traveler.id AS "travelerId",
                    traveler.name AS "name",
                    traveler.email_address AS "emailAddress",
                    traveler.email_confirmed AS "emailConfirmed", 
                    settings.is_dark AS "isDark", 
                    settings.font_family AS "fontFamily"
                  FROM traveler
                  INNER JOIN settings
                  ON traveler.id = settings.traveler_id
                  WHERE traveler.id = $1;
                `;

  try {
    const sessionResponse = await client.query(sessionQuery, [travelerId]);

    return <HeliosApp session={sessionResponse.rows[0]}>{children}</HeliosApp>;
  } catch (error) {
    //TODO: Add failed login code path
    return <h1>failure</h1>;
  } finally {
    client.release();
  }
}

const HeliosApp = ({ children, session }) => {
  return (
    <ContextProvider currentSession={session}>
      <div className={styles.wrapper}>
        <nav className={styles.appNav}>
          <AppNav />
        </nav>

        <main>
          <header>
            <PageName />

            <span>
              <HeaderWriteButton />

              <Link href='/profile' className={styles.profile}>
                <MdPersonOutline />
              </Link>
            </span>
          </header>

          <div className={styles.contentWrapper}>
            <div className={styles.content}>{children}</div>
          </div>
        </main>

        <MobileAppNav />
      </div>
    </ContextProvider>
  );
};
