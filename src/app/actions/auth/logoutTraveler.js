'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

export const logoutTraveler = async () => {
  const heliosAuth = cookies().get('heliosAuth');
  if (heliosAuth) await redis.del(`heliosTraveler:${heliosAuth.value}`);
  cookies().delete('heliosAuth');

  return {
    code: 200,
    payload: { message: 'successfully logged out' },
  };
};
