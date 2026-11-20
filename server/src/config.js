import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  // Adresa frontend-ului Angular (ng serve) - folosită la CORS pentru Laboratorul 4
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/techstore',
};
