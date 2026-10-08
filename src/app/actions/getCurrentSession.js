'use server';
import { getSession } from '@/lib/auth.js';
import { connectToDatabase } from '@/lib/config/postgres.js';
const { pool } = connectToDatabase();

export default async function getCurrentSession() {
  const { travelerId, code } = await getSession();
  if (!travelerId) return { code };

  const client = await pool.connect();
  try {
    const query = `
                      SELECT
                        traveler.id AS "travelerId",
                        traveler.name AS "name",
                        traveler.email_address AS "emailAddress",
                        traveler.email_confirmed AS "emailConfirmed", 
                        settings.is_dark AS "isDark", 
                        settings.font_family AS "fontFamily"
                      FROM traveler
                      INNER JOIN settings
                      ON traveler.id = settings.traveler_id
                      WHERE traveler.id = $1;
                    `;
    const { rows } = await client.query(query, [travelerId]);

    return { code: 200, traveler: rows[0] };
  } catch (error) {
    return ({ error }, { status: 500 });
  } finally {
    client.release();
  }
}
