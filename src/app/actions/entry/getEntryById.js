'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getEntryById = async (id) => {
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const client = await pool.connect();

  try {
    const query = 'SELECT * FROM entry WHERE id = $1 AND traveler_id = $2';
    const { rows } = await client.query(query, [id, travelerId]);

    return { code: 200, payload: rows };
  } catch (error) {
    return { code: 500, payload: 'could not fetch entry.' };
  } finally {
    client.release();
  }
};
