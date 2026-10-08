'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const updateEntryBody = async (id, body) => {
  if (!id) return { code: 400 };
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const client = await pool.connect();
  try {
    const query = 'UPDATE entry SET body = $1 WHERE id = $2 AND traveler_id = $3;';
    const { rowCount } = await client.query(query, [body, id, travelerId]);
    if (rowCount === 0) return { code: 404 };

    return { code: 200 };
  } catch (error) {
    return { code: 500 };
  } finally {
    client.release();
  }
};
