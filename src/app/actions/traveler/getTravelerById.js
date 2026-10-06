'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export async function getTravelerById(searchId) {
  const heliosAuth = (await cookies()).get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const currTravelerId = await redis.hget(`heliosTravler:${heliosAuth}`, 'travelerId');
  if (!currTravelerId) return { code: 401 };

  const client = await pool.connect();
  try {
    let query = `
                  SELECT id, email_address, name
                  WHERE traveler_id = $1;
                `;
    const res = await client.query(query, [searchId ? searchId : currTravelerId]);

    return res.rows;
  } catch (error) {
    return { code: 500, message: 'could not fetch traveler' };
  } finally {
    client.release();
  }
}
