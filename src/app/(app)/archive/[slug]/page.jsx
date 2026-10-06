import { getEntryBySlug, getNextEntry, getPreviousEntry } from '@/app/actions';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import EntryContainer from '../EntryContainer';

export default async function Page({ params }) {
  const heliosAuth = (await cookies()).get('heliosAuth')?.value;
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');

  const { payload } = await getEntryBySlug((await params).slug, travelerId);
  const entry = payload[0];

  const previousEntry = (await getPreviousEntry(entry.created_at)).payload;

  const nextEntry = (await getNextEntry(entry.created_at)).payload;

  return <EntryContainer entry={entry} nextEntry={nextEntry} previousEntry={previousEntry} />;
}
