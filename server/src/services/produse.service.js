import { query } from '../db/pool.js';
import { badRequest, notFound } from '../utils/httpError.js';

// Doar aceste valori ajung în ORDER BY (listă albă, nu text primit de la client)
const SORTARI = {
  pret_asc: 'pret ASC, id ASC',
  pret_desc: 'pret DESC, id ASC',
  nume: 'nume ASC, id ASC',
};

// Singurele coloane care pot fi modificate
const COLOANE = ['nume', 'descriere', 'pret', 'imagine', 'alt'];

const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

function parseNumberParam(value, name) {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw badRequest(`Parametrul ${name} trebuie să fie un număr pozitiv`);
  return n;
}

/** Filtrare: ?q=laptop&minPret=500&maxPret=2000&sort=pret_asc|pret_desc|nume */
export function list({ q, minPret, maxPret, sort } = {}) {
  const min = parseNumberParam(minPret, 'minPret');
  const max = parseNumberParam(maxPret, 'maxPret');

  if (sort !== undefined && !SORTARI[sort]) {
    throw badRequest(`Parametrul sort trebuie să fie unul dintre: ${Object.keys(SORTARI).join(', ')}`);
  }

  const conditions = [];
  const params = [];

  if (typeof q === 'string' && q.trim()) {
    params.push(`%${escapeLike(q.trim())}%`);
    conditions.push(`(nume ILIKE $${params.length} OR descriere ILIKE $${params.length})`);
  }
  if (min !== undefined) {
    params.push(min);
    conditions.push(`pret >= $${params.length}`);
  }
  if (max !== undefined) {
    params.push(max);
    conditions.push(`pret <= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return query(
    `SELECT id, nume, descriere, pret, imagine, alt FROM produse ${where} ORDER BY ${SORTARI[sort] ?? 'id ASC'}`,
    params,
  );
}

export async function getById(id) {
  const [produs] = await query('SELECT id, nume, descriere, pret, imagine, alt FROM produse WHERE id = $1', [id]);
  if (!produs) throw notFound(`Produsul cu id ${id} nu există`);
  return produs;
}

export async function create({ nume, descriere, pret, imagine, alt }) {
  const [produs] = await query(
    `INSERT INTO produse (nume, descriere, pret, imagine, alt)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nume, descriere, pret, imagine, alt`,
    [nume, descriere, pret, imagine, alt],
  );
  return produs;
}

export async function update(id, changes) {
  const keys = Object.keys(changes).filter((k) => COLOANE.includes(k));
  const setSql = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => changes[k]);

  const [produs] = await query(
    `UPDATE produse SET ${setSql} WHERE id = $${keys.length + 1}
     RETURNING id, nume, descriere, pret, imagine, alt`,
    [...values, id],
  );
  if (!produs) throw notFound(`Produsul cu id ${id} nu există`);
  return produs;
}

export async function remove(id) {
  const rows = await query('DELETE FROM produse WHERE id = $1 RETURNING id', [id]);
  if (rows.length === 0) throw notFound(`Produsul cu id ${id} nu există`);
}
