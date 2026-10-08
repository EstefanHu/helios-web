import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

// Resolves the signed-in traveler from the session cookie. This is the only trustworthy
// source of identity: server actions are public endpoints, so never accept a traveler id
// from the client. Returns { travelerId } on success, otherwise { code } -- 401 when there
// is no session cookie, 440 when the session has expired. cache() dedupes the Redis
// lookup across a single server render.
export const getSession = cache(async () => {
  const heliosAuth = (await cookies()).get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  return { travelerId };
});
