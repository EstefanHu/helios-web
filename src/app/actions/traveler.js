'use server';
import { cookies } from 'next/headers';
import redis from '@/lib/config/redis.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

// Create Traveler - Admin endpoint
export async function createTraveler() {
  return {};
}

export async function getTravelerbyId(searchId) {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const currTravelerId = await redis.hget(`heliosTravler:${heliosAuth}`, 'travelerId');
  if (!currTravelerId) return { code: 401 };
  const client = await pool.connect();
  try {
    let query = `
                  SELECT id, email_address, name
                  WHERE traveler_id = $2
                `;
    const res = await client.query(query, [searchId ? searchId : currTravelerId]);

    return res.rows;
  } catch (error) {
    return { code: 500, message: 'could not fetch traveler' };
  } finally {
    client.release();
  }
}

export async function updateTraveler(traveler) {
  const heliosAuth = cookies().get('heliosAuth')?.value;
  if (!heliosAuth) return { code: 401 };
  const currTravelerId = await redis.hget(`heliosTraveler:${heliosAuth}`, 'travelerId');
  if (!currTravelerId) return { code: 401 };
  const { name } = traveler;
  const client = await pool.connect();
  try {
    const query = `
      UPDATE traveler SET
      name = $1
      WHERE id = $2
    `;
    const res = await client.query(query, [name, currTravelerId]);

    return res.rows;
  } catch (error) {
    return { code: 500, message: 'could not update traveler' };
  } finally {
    client.release();
  }
}

// Delete Traveler - Current session or Admin
export async function deleteTraveler() {
  return {};
}
