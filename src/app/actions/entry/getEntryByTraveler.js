'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getEntryByTraveler = async ({ limit = 1, offset = 0 } = {}) => {
  const { travelerId: currTravelerId, code } = await getSession();
  if (!currTravelerId) return { code };

  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM entry WHERE traveler_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;';
    const { rows } = await client.query(query, [currTravelerId, limit, offset]);

    return { code: 200, payload: rows };
  } catch (error) {
    return { code: 500, payload: 'could not fetch entry.' };
  } finally {
    client.release();
  }
};
