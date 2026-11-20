import { badRequest } from '../utils/httpError.js';

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

/**
 * Validează corpul pentru produs.
 * partial=false -> POST/PUT (câmpurile obligatorii trebuie să existe)
 * partial=true  -> PATCH (doar câmpurile trimise sunt verificate)
 */
export function validateProdus(body = {}, { partial = false } = {}) {
  const errors = {};
  const data = {};
  const has = (key) => body[key] !== undefined;

  const text = (key, min, max, required = true) => {
    if (!has(key)) {
      if (required && !partial) errors[key] = 'Câmpul este obligatoriu';
      return;
    }
    const value = body[key];
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
      errors[key] = `Trebuie să fie text între ${min} și ${max} caractere`;
      return;
    }
    data[key] = value.trim();
  };

  text('nume', 2, 100);
  text('descriere', 5, 500);
  text('alt', 2, 150, false);

  if (has('pret')) {
    if (typeof body.pret !== 'number' || !Number.isFinite(body.pret) || body.pret <= 0 || body.pret > 1_000_000_000) {
      errors.pret = 'Prețul trebuie să fie un număr între 0.01 și 1.000.000.000';
    } else {
      data.pret = body.pret;
    }
  } else if (!partial) {
    errors.pret = 'Câmpul este obligatoriu';
  }

  if (has('imagine')) {
    if (typeof body.imagine !== 'string' || !isHttpUrl(body.imagine)) {
      errors.imagine = 'Trebuie să fie un URL valid (http/https)';
    } else {
      data.imagine = body.imagine;
    }
  } else if (!partial) {
    errors.imagine = 'Câmpul este obligatoriu';
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest('Date invalide', errors);
  }
  if (partial && Object.keys(data).length === 0) {
    throw badRequest('Nu ai trimis niciun câmp de modificat');
  }

  // dacă lipsește textul alternativ la creare, folosim numele produsului
  if (!partial && data.alt === undefined) data.alt = data.nume;

  return data;
}
