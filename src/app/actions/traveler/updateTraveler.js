'use server';
import { getSession } from '@/lib/auth.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export async function updateTraveler(traveler) {
  const { travelerId: currTravelerId, code } = await getSession();
  if (!currTravelerId) return { code };

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
