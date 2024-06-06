'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getEntryCount = async () => {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  const client = await pool.connect();
  try {
    const query = 'SELECT count(*) FROM entry WHERE traveler_id = $1;';
    const { rows } = await client.query(query, [travelerId]);

    return { code: 200, payload: rows[0].count };
  } catch (error) {
    return { code: 500, payload: 'could not fetch entry.' };
  } finally {
    client.release();
  }
};
