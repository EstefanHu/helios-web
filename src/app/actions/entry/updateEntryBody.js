'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const updateEntryBody = async (id, body) => {
  if (!id) return { code: 400 };
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  const client = await pool.connect();
  try {
    const query = 'UPDATE entry SET body = $1 WHERE id = $2;';
    await client.query(query, [body, id]);

    return { code: 200 };
  } catch (error) {
    return { code: 500 };
  } finally {
    client.release();
  }
};
