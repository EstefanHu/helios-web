'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';

import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export const getOrCreateEntryBySlug = async (slug) => {
  if (!slug) return { code: 400 };
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const travelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!travelerId) return { code: 440 };

  const client = await pool.connect();
  try {
    const optimisticQuery = 'SELECT * FROM entry WHERE slug = $1 AND traveler_id = $2;';
    const optimisticRes = await client.query(optimisticQuery, [slug, travelerId]);
    if (optimisticRes.rows.length === 0) {
      // TODO: Adjust title format
      const query = 'INSERT INTO entry(title, slug, traveler_id) VALUES ($1, $2, $3) RETURNING *;';
      const { rows } = await client.query(query, [slug.replaceAll('-', ' '), slug, travelerId]);

      return { code: 200, payload: rows[0] };
    }

    return { code: 200, payload: optimisticRes.rows[0] };
  } catch (error) {
    return { code: 500 };
  } finally {
    client.release();
  }
};
