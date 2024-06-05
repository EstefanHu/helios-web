'use server';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const updateTravelerPassword = async ({ oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) return { code: 400 };
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

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
