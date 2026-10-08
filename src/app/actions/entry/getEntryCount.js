'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getEntryCount = async () => {
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

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
