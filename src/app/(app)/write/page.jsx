import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';
import Deauth from '@/app/(app)/Deauth.jsx';
import { WriteInput, ClientRenderWriteInput } from './WriteInput.jsx';
import { getEntryBySlug } from '@/app/actions';
import styles from './Write.module.scss';

export const metadata = {
  title: 'Write | Helios',
  description: 'Writing new entry',
};

export default async function Page({ searchParams }) {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return <Deauth />;
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return <Deauth />;

  const { s } = searchParams;
  if (!s) return <ClientRenderWriteInput searchParams={searchParams} />;
  const { payload } = await getEntryBySlug(s, travelerId);
  if (payload.length === 0) redirect(`/entry-doesnt-exist?target=write&val=${s}`);

  return (
    <div className={styles.pageWrapper}>
      <h1>{payload.title}</h1>

      <WriteInput id={payload.id} body={payload.body} />
    </div>
  );
}
