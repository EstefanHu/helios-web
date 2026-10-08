'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const createEntry = async () => {
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const client = await pool.connect();

  try {
    const query = '';
    const { rows } = await client.query(query, []);

    return { code: 200, payload: rows };
  } catch (error) {
    return { code: 500, payload: 'could not fetch entry.' };
  } finally {
    client.release();
  }
};
