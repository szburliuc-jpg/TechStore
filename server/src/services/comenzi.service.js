import { query } from '../db/pool.js';
import { badRequest, notFound } from '../utils/httpError.js';
import { STATUSURI } from '../validators/comanda.validator.js';

const COLOANE = `
  id, produs_id, produs_nume, pret_unitar, cantitate, total,
  client_nume, client_email, client_telefon, client_adresa, status, creat_la
`;

/** Rând SQL -> obiectul JSON trimis clientului. */
function mapComanda(r) {
  return {
    id: r.id,
    produsId: r.produs_id,
    produsNume: r.produs_nume,
    pretUnitar: r.pret_unitar,
    cantitate: r.cantitate,
    total: r.total,
    client: {
      nume: r.client_nume,
      email: r.client_email,
      telefon: r.client_telefon ?? undefined,
      adresa: r.client_adresa,
    },
    status: r.status,
    creatLa: r.creat_la,
  };
}

export async function list({ status } = {}) {
  if (status !== undefined && !STATUSURI.includes(status)) {
    throw badRequest(`Parametrul status trebuie să fie unul dintre: ${STATUSURI.join(', ')}`);
  }
  const rows = status
    ? await query(`SELECT ${COLOANE} FROM comenzi WHERE status = $1 ORDER BY id`, [status])
    : await query(`SELECT ${COLOANE} FROM comenzi ORDER BY id`);
  return rows.map(mapComanda);
}

export async function getById(id) {
  const [row] = await query(`SELECT ${COLOANE} FROM comenzi WHERE id = $1`, [id]);
  if (!row) throw notFound(`Comanda cu id ${id} nu există`);
  return mapComanda(row);
}

/** Totalul se calculează pe server, din prețul din baza de date (nu din ce trimite clientul). */
export async function create({ produsId, cantitate, nume, email, telefon, adresa }) {
  const [produs] = await query('SELECT id, nume, pret FROM produse WHERE id = $1', [produsId]);
  if (!produs) throw notFound(`Produsul cu id ${produsId} nu există`);

  const [row] = await query(
    `INSERT INTO comenzi
       (produs_id, produs_nume, pret_unitar, cantitate, total,
        client_nume, client_email, client_telefon, client_adresa)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${COLOANE}`,
    [produs.id, produs.nume, produs.pret, cantitate, produs.pret * cantitate, nume, email, telefon ?? null, adresa],
  );
  return mapComanda(row);
}

export async function updateStatus(id, status) {
  const comanda = await getById(id);
  if (comanda.status === 'anulata') {
    throw badRequest('Comanda este anulată și nu mai poate fi modificată');
  }
  if (comanda.status === 'livrata' && status !== 'livrata') {
    throw badRequest('Comanda este deja livrată și nu mai poate fi modificată');
  }
  const [row] = await query(`UPDATE comenzi SET status = $1 WHERE id = $2 RETURNING ${COLOANE}`, [status, id]);
  return mapComanda(row);
}
