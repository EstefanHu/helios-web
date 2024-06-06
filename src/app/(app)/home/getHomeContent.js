'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export default async function getHomeContent() {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  const client = await pool.connect();
  try {
    // TODO: Fetch analytics
    // TODO: Fetch feed
    const payload = {};
    const getActiveEntries = `
                              SELECT * FROM entry
                              WHERE status = 'active'
                              AND traveler_id = $1
                              ORDER BY created_at DESC;
                            `;
    const activeEntries = await client.query(getActiveEntries, [travelerId]);
    payload.active = activeEntries.rows;

    return { code: 200, payload };
  } catch (error) {
    return { code: 500 };
  } finally {
    client.release();
  }
}
