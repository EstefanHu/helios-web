'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getEntryByTraveler = async ({ travelerId, limit = 1, offset = 0 }) => {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const currTravelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!currTravelerId) return { code: 440 };

  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM entry WHERE traveler_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;';
    const { rows } = await client.query(query, [travelerId ? travelerId : currTravelerId, limit, offset]);

    return { code: 200, payload: rows };
  } catch (error) {
    return { code: 500, payload: 'could not fetch entry.' };
  } finally {
    client.release();
  }
};
