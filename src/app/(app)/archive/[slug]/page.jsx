import { getEntryBySlug } from '@/app/actions';
import viewer from './viewer.module.scss';

import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

// export async function generateStaticParams() {
//   // TODO: replace user id
//   const entries = await getEntries(1);

//   return entries.map((entry) => ({
//     slug: entry.slug,
//   }));
// }

export default async function Page({ params }) {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');

  const { payload } = await getEntryBySlug(params.slug, travelerId);
  const entry = payload[0];

  return (
    <section className={viewer.viewerContainer}>
      <div className={viewer.viewerDetails}>
        <div className={viewer.createdTimeDate}>
          <span>
            {entry.created_at.toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span>{entry.created_at.toLocaleTimeString('en-us', { timeStyle: 'short' })}</span>
        </div>
        <div className={viewer.editGroup}>
          <button>edit</button>
          <span className='italicLight'>
            last edited {entry.updated_at.toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
      <h1 className='title'>{entry.title}</h1>
      <p className='bodyText'>{entry.body}</p>
    </section>
  );
}
