'use server';
import bcrypt from 'bcrypt';
import { ValidateEmailAddress } from '@/lib/helpers/validateEmailAddress.js';
import { setTravelerSession } from './setTravelerSession';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export async function loginTraveler(emailAddress, password) {
  if (!emailAddress || !password || !ValidateEmailAddress(emailAddress)) return { code: 400, message: 'bad request' };
  const client = await pool.connect();

  try {
    const query = `SELECT id, password FROM traveler WHERE email_address = $1;`;
    const { rows } = await client.query(query, [emailAddress]);
    if (rows.length === 0) throw 'failed authentication';
    if (!(await bcrypt.compare(password, rows[0].password))) throw 'failed authentication';
    await setTravelerSession(rows[0].id);

    return {
      code: 200,
      payload: { message: 'continuing journey' },
    };
  } catch (error) {
    return { code: 401, payload: { message: 'Email or Password were incorrect' } };
  } finally {
    client.release();
  }
}
