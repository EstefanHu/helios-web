'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getOrCreateEntryByTitle = async (title) => {
  if (!title) return { code: 400 };
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const client = await pool.connect();
  try {
    const optimisticQuery = 'SELECT * FROM entry WHERE title = $1 AND traveler_id = $2;';
    const optimisticRes = await client.query(optimisticQuery, [title, travelerId]);
    if (optimisticRes.rows.length === 0) {
      const query = 'INSERT INTO entry(title, traveler_id) VALUES ($1, $2) RETURNING *;';
      const { rows } = await client.query(query, [title, travelerId]);

      return { code: 200, payload: rows[0] };
    }

    return { code: 200, payload: optimisticRes.rows[0] };
  } catch (error) {
    return { code: 500 };
  } finally {
    client.release();
  }
};
