import Link from 'next/link';
import { MdPersonOutline } from 'react-icons/md';
import { AppNav, HeaderWriteButton, MobileAppNav, PageName } from './AppLayoutClientComponents';
import Deauth from './Deauth';
import { ContextProvider } from '@/lib/context';
import { getSession } from '@/lib/auth.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
import styles from './layout.module.scss';

const { pool } = connectToDatabase();

export default async function AppLayout({ children }) {
  const { travelerId } = await getSession();
  if (!travelerId) return <HeliosDeauth />;

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

  let session;
  let queryFailed = false;

  try {
    const sessionResponse = await client.query(sessionQuery, [travelerId]);
    session = sessionResponse.rows[0];
  } catch (error) {
    //TODO: Add failed login code path
    queryFailed = true;
  } finally {
    client.release();
  }

  // JSX is constructed outside the try/catch on purpose -- React renders
  // elements lazily, so wrapping them here would not catch render errors anyway.
  if (queryFailed) return <h1>failure</h1>;

  return <HeliosApp session={session}>{children}</HeliosApp>;
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

export function HeliosDeauth() {
  return (
    <ContextProvider>
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
            <div className={styles.content}>
              <Deauth />
            </div>
          </div>
        </main>

        <MobileAppNav />
      </div>
    </ContextProvider>
  );
}
