'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export async function updateTraveler(traveler) {
  const heliosAuth = (await cookies()).get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const currTravelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!currTravelerId) return { code: 401 };

  const client = await pool.connect();
  try {
    const { name } = traveler;

    const query = `
      UPDATE traveler
      SET name = $1
      WHERE id = $2;
    `;
    const res = await client.query(query, [name, currTravelerId]);

    return res.rows;
  } catch (error) {
    return { code: 500, message: 'could not update traveler' };
  } finally {
    client.release();
  }
}
