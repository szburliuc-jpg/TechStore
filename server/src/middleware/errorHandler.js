import { HttpError } from '../utils/httpError.js';

/** 404 pentru orice rută inexistentă. */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { status: 404, message: `Ruta ${req.method} ${req.originalUrl} nu există` },
  });
}

// Coduri de eroare PostgreSQL pentru date invalide (plasă de siguranță în spatele validatoarelor proprii)
const PG_DATE_INVALIDE = new Set(['22P02', '22003', '22001', '23502', '23514']);

/** Format unic pentru toate erorile: { error: { status, message, details? } } */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { status: err.status, message: err.message, details: err.details },
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { status: 400, message: 'JSON invalid în corpul cererii' } });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: { status: 413, message: 'Cererea este prea mare' } });
  }

  if (PG_DATE_INVALIDE.has(err.code)) {
    return res.status(400).json({ error: { status: 400, message: 'Date invalide' } });
  }

  console.error(err);
  res.status(500).json({ error: { status: 500, message: 'Eroare internă de server' } });
}
