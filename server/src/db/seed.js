import { pathToFileURL } from 'node:url';
import { pool, query, closePool } from './pool.js';
import { initDb } from './init.js';

// Aceleași produse ca în frontend (client/src/app/features/products/products.ts)
const PRODUSE = [
  {
    nume: 'Căști Wireless',
    descriere: 'Sunet de calitate și confort pentru fiecare zi.',
    pret: 899,
    imagine: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    alt: 'Căști wireless',
  },
  {
    nume: 'Smartwatch',
    descriere: 'Monitorizează-ți activitatea și rămâi conectat.',
    pret: 1299,
    imagine: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    alt: 'Smartwatch',
  },
  {
    nume: 'Laptop',
    descriere: 'Performanță bună pentru studii și lucru.',
    pret: 14999,
    imagine: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
    alt: 'Laptop',
  },
];

async function insertProduse() {
  for (const p of PRODUSE) {
    await pool.query(
      'INSERT INTO produse (nume, descriere, pret, imagine, alt) VALUES ($1, $2, $3, $4, $5)',
      [p.nume, p.descriere, p.pret, p.imagine, p.alt],
    );
  }
}

/** Apelată la pornirea serverului: adaugă produsele doar dacă tabelul e gol. */
export async function seedIfEmpty() {
  const [{ count }] = await query('SELECT COUNT(*)::int AS count FROM produse');
  if (count === 0) {
    await insertProduse();
    console.log(`Seed: ${PRODUSE.length} produse adăugate`);
  }
}

// `npm run seed` -> șterge TOATE datele, resetează id-urile și reia de la zero
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await initDb();
  await pool.query('TRUNCATE comenzi, mesaje, produse RESTART IDENTITY CASCADE');
  await insertProduse();
  console.log('Baza de date a fost resetată și populată cu produsele inițiale');
  await closePool();
}
