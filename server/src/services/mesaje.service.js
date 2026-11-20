import { query } from '../db/pool.js';
import { notFound } from '../utils/httpError.js';

const COLOANE = 'id, nume, email, mesaj, creat_la AS "creatLa"';

export function list() {
  return query(`SELECT ${COLOANE} FROM mesaje ORDER BY id`);
}

export async function getById(id) {
  const [mesaj] = await query(`SELECT ${COLOANE} FROM mesaje WHERE id = $1`, [id]);
  if (!mesaj) throw notFound(`Mesajul cu id ${id} nu există`);
  return mesaj;
}

export async function create({ nume, email, mesaj }) {
  const [row] = await query(
    `INSERT INTO mesaje (nume, email, mesaj) VALUES ($1, $2, $3) RETURNING ${COLOANE}`,
    [nume, email, mesaj],
  );
  return row;
}
