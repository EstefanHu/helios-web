import Link from 'next/link';
import Deauth from '../Deauth';
import getHomeContent from './getHomeContent';
import styles from './Home.module.scss';

export const metadata = {
  title: 'Home | Helios',
  description: 'Helios home',
};

export default async function Home() {
  const { code, payload } = await getHomeContent();
  if (code === 401 || code === 440) return <Deauth />;

  return (
    <div className={styles.homeWrapper}>
      {payload.active.length === 0 ? <CallToCreate /> : <ActiveData data={payload.active} />}
    </div>
  );
}

const CallToCreate = () => {
  return (
    <section className={styles.callToCreate}>
      <h1>You have no active entries.</h1>
      <p>Lets get you started!</p>
      <Link href='/write'>create daily</Link>
    </section>
  );
};

const ActiveData = ({ data }) => {
  return (
    <section className={styles.activeData}>
      <h1>Active Data</h1>
      {data.map((d) => (
        <h1 key={d.title}>{d.title}</h1>
      ))}
    </section>
  );
};
