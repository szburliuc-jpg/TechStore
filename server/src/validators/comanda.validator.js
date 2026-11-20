import { badRequest } from '../utils/httpError.js';
import { isValidId } from '../utils/parseId.js';

export const STATUSURI = ['noua', 'confirmata', 'expediata', 'livrata', 'anulata'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFON_RE = /^\+?[0-9\s\-()]{6,20}$/;

export function validateComanda(body = {}) {
  const errors = {};

  if (!isValidId(body.produsId)) {
    errors.produsId = 'produsId trebuie să fie un număr întreg pozitiv';
  }

  const cantitate = body.cantitate ?? 1;
  if (!Number.isInteger(cantitate) || cantitate < 1 || cantitate > 100) {
    errors.cantitate = 'Cantitatea trebuie să fie un număr întreg între 1 și 100';
  }

  if (typeof body.nume !== 'string' || body.nume.trim().length < 2 || body.nume.trim().length > 100) {
    errors.nume = 'Numele trebuie să aibă între 2 și 100 de caractere';
  }

  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim())) {
    errors.email = 'Adresa de email nu este validă';
  }

  if (body.telefon !== undefined && (typeof body.telefon !== 'string' || !TELEFON_RE.test(body.telefon.trim()))) {
    errors.telefon = 'Numărul de telefon nu este valid';
  }

  if (typeof body.adresa !== 'string' || body.adresa.trim().length < 5 || body.adresa.trim().length > 200) {
    errors.adresa = 'Adresa trebuie să aibă între 5 și 200 de caractere';
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest('Date invalide', errors);
  }

  return {
    produsId: body.produsId,
    cantitate,
    nume: body.nume.trim(),
    email: body.email.trim().toLowerCase(),
    telefon: body.telefon?.trim(),
    adresa: body.adresa.trim(),
  };
}

export function validateStatus(body = {}) {
  if (!STATUSURI.includes(body.status)) {
    throw badRequest('Status invalid', { status: `Valori permise: ${STATUSURI.join(', ')}` });
  }
  return body.status;
}
