import { cookies } from 'next/headers';
import { v4 as generateUUID } from 'uuid';
import redis from '@/lib/config/redis.js';

export const setTravelerSession = async (travelerId) => {
  const token = generateUUID();
  const key = `heliosTraveler:${token}`;
  const repeatedToken = await redis.exists(key);
  if (repeatedToken === 1) return setTravelerSession(travelerId);
  await redis.hset(key, { travelerId });
  await redis.expire(key, Number(process.env.SESSIONS_TTL));
  (await cookies()).set({
    name: 'heliosAuth',
    value: token,
    maxAge: Number(process.env.SESSIONS_TTL),
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
  });
};
