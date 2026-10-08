import { getEntryBySlug, getNextEntry, getPreviousEntry } from '@/app/actions';
import { getSession } from '@/lib/auth.js';
import Deauth from '../../Deauth';
import EntryContainer from '../EntryContainer';

export default async function Page({ params }) {
  const { travelerId } = await getSession();
  if (!travelerId) return <Deauth />;

  const { payload } = await getEntryBySlug((await params).slug);
  const entry = payload[0];

  const previousEntry = (await getPreviousEntry(entry.created_at)).payload;

  const nextEntry = (await getNextEntry(entry.created_at)).payload;

  return <EntryContainer entry={entry} nextEntry={nextEntry} previousEntry={previousEntry} />;
}
