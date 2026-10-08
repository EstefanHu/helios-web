import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth.js';
import Deauth from '@/app/(app)/Deauth.jsx';
import { WriteInput, ClientRenderWriteInput } from './WriteInput.jsx';
import { getEntryBySlug } from '@/app/actions';
import styles from './Write.module.scss';

export const metadata = {
  title: 'Write | Helios',
  description: 'Writing new entry',
};

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { travelerId } = await getSession();
  if (!travelerId) return <Deauth />;

  const { s } = resolvedSearchParams;
  if (!s) return <ClientRenderWriteInput searchParams={resolvedSearchParams} />;
  const { payload } = await getEntryBySlug(s);
  if (payload.length === 0) redirect(`/entry-doesnt-exist?target=write&val=${s}`);

  return (
    <div className={styles.pageWrapper}>
      <WriteInput entry={payload[0]} />
    </div>
  );
}
