import { pool } from './pool.js';
import { STATUSURI } from '../validators/comanda.validator.js';

const statusuriSql = STATUSURI.map((s) => `'${s}'`).join(', ');

/** Creează tabelele dacă nu există (se apelează la fiecare pornire a serverului). */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS produse (
  id         SERIAL PRIMARY KEY,
  nume       TEXT NOT NULL,
  descriere  TEXT NOT NULL,
  pret       NUMERIC(12, 2) NOT NULL CHECK (pret > 0),
  imagine    TEXT NOT NULL,
  alt        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comenzi (
  id              SERIAL PRIMARY KEY,
  -- dacă produsul se șterge, comanda rămâne (produs_id devine NULL, iar numele/prețul sunt păstrate mai jos)
  produs_id       INTEGER REFERENCES produse(id) ON DELETE SET NULL,
  produs_nume     TEXT NOT NULL,
  pret_unitar     NUMERIC(12, 2) NOT NULL,
  cantitate       INTEGER NOT NULL CHECK (cantitate BETWEEN 1 AND 100),
  total           NUMERIC(14, 2) NOT NULL,
  client_nume     TEXT NOT NULL,
  client_email    TEXT NOT NULL,
  client_telefon  TEXT,
  client_adresa   TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'noua' CHECK (status IN (${statusuriSql})),
  creat_la        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mesaje (
  id        SERIAL PRIMARY KEY,
  nume      TEXT NOT NULL,
  email     TEXT NOT NULL,
  mesaj     TEXT NOT NULL,
  creat_la  TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

export async function initDb() {
  await pool.query(SCHEMA);
  console.log('PostgreSQL conectat, tabelele sunt pregătite');
}
