'use server';
import bcrypt from 'bcrypt';
import { ValidateEmailAddress } from '@/lib/helpers/validateEmailAddress';
import { setTravelerSession } from './setTravelerSession';
import { connectToDatabase } from '@/lib/config/postgres';
const { pool } = connectToDatabase();

export async function registerTraveler(emailAddress, password) {
  if (!emailAddress || !password || !ValidateEmailAddress(emailAddress)) return { code: 400, message: 'bad request' };
  const client = await pool.connect();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO traveler(email_address, password) VALUES ($1, $2) RETURNING id;';
    const { rows } = await client.query(query, [emailAddress, hashedPassword]);
    await setTravelerSession(rows[0].id);

    return {
      code: 201,
      payload: { message: 'traveler created' },
    };
  } catch (error) {
    const { code, column } = error;
    switch (code) {
      case '23502':
        return { code: 400, message: `Missing field: ${column}` };
      case '23505':
        return { code: 409, message: 'email address already in use' };
      default:
        return { code: 500, message: 'traveler creation failed' };
    }
  } finally {
    client.release();
  }
}
