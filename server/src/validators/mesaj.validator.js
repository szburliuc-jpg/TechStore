import { badRequest } from '../utils/httpError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMesaj(body = {}) {
  const errors = {};

  if (typeof body.nume !== 'string' || body.nume.trim().length < 2 || body.nume.trim().length > 100) {
    errors.nume = 'Numele trebuie să aibă între 2 și 100 de caractere';
  }
  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim())) {
    errors.email = 'Adresa de email nu este validă';
  }
  if (typeof body.mesaj !== 'string' || body.mesaj.trim().length < 10 || body.mesaj.trim().length > 2000) {
    errors.mesaj = 'Mesajul trebuie să aibă între 10 și 2000 de caractere';
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest('Date invalide', errors);
  }

  return {
    nume: body.nume.trim(),
    email: body.email.trim().toLowerCase(),
    mesaj: body.mesaj.trim(),
  };
}
