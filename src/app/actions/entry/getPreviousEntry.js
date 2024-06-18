'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getPreviousEntry = async (currentEntryDate) => {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  const query = `
      SELECT *
      FROM entry
      WHERE created_at::DATE < $1::DATE
      ORDER BY created_at::DATE DESC
      LIMIT 1;
    `;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, [currentEntryDate]);

    return { code: 200, payload: rows[0] };
  } catch (error) {
    return { code: 500, message: 'could not get previous entry. ' + error.message };
  } finally {
    client.release();
  }
};
