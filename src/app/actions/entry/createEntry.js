'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const createEntry = async () => {
  const heliosAuth = (await cookies()).get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  const client = await pool.connect();

  try {
    const query = '';
    const { rows } = await client.query(query, []);

    return { code: 200, payload: rows };
  } catch (error) {
    return { code: 500, payload: 'could not fetch entry.' };
  } finally {
    client.release();
  }
};
