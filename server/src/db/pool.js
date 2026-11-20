import pg from 'pg';
import { config } from '../config.js';

// NUMERIC (prețuri, total) vine implicit ca string din PostgreSQL; îl convertim în număr
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => parseFloat(value));

const isNeon = /neon\.tech/.test(config.databaseUrl);

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  // Neon cere conexiune SSL (dacă URL-ul are deja ?sslmode=require, acela are prioritate)
  ssl: isNeon ? { rejectUnauthorized: true } : undefined,
  max: 10,
  connectionTimeoutMillis: 10000, // Neon free poate avea nevoie de câteva secunde să "se trezească"
});

/** Scurtătură: query(text, params) -> rânduri (array) */
export async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

export async function closePool() {
  await pool.end();
}
