'use server';
import bcrypt from 'bcrypt';
import { getSession } from '@/lib/auth.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const updateTravelerPassword = async ({ oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) return { code: 400 };
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const client = await pool.connect();
  try {
    const travelerQuery = 'SELECT password FROM traveler WHERE id = $1 LIMIT 1;';
    const { rows } = await client.query(travelerQuery, [travelerId]);
    if (rows.length === 0) return { code: 404 };
    if (!(await bcrypt.compare(oldPassword, rows[0].password))) return { code: 401 };
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE traveler SET password = $1 WHERE id = $2;';
    await client.query(query, [newHashedPassword, travelerId]);

    return { code: 200 };
  } catch (error) {
    return { code: 500 };
  } finally {
    client.release();
  }
};
