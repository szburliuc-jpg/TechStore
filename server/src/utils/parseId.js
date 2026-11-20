import { badRequest } from './httpError.js';

const MAX_INT4 = 2147483647; // limita unui SERIAL din PostgreSQL

export const isValidId = (value) => Number.isInteger(value) && value > 0 && value <= MAX_INT4;

/** Transformă parametrul din URL într-un id numeric valid sau aruncă 400. */
export function parseId(raw) {
  const id = Number(raw);
  if (!isValidId(id)) {
    throw badRequest('Id invalid: trebuie să fie un număr întreg pozitiv');
  }
  return id;
}
