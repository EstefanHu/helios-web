'use server';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getPreviousEntry = async (currentEntryDate) => {
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const query = `
      SELECT *
      FROM entry
      WHERE created_at::DATE < $1::DATE
      AND traveler_id = $2
      ORDER BY created_at::DATE DESC
      LIMIT 1;
    `;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, [currentEntryDate, travelerId]);

    return { code: 200, payload: rows[0] };
  } catch (error) {
    return { code: 500, message: 'could not get previous entry. ' + error.message };
  } finally {
    client.release();
  }
};
