'use server';
import { getSession } from '@/lib/auth.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export async function getTravelerById() {
  const { travelerId: currTravelerId, code } = await getSession();
  if (!currTravelerId) return { code };

  const client = await pool.connect();
  try {
    let query = `
                  SELECT id, email_address, name
                  FROM traveler
                  WHERE id = $1;
                `;
    const res = await client.query(query, [currTravelerId]);

    return res.rows;
  } catch (error) {
    return { code: 500, message: 'could not fetch traveler' };
  } finally {
    client.release();
  }
}
