import app from './app.js';
import { config } from './config.js';
import { initDb } from './db/init.js';
import { seedIfEmpty } from './db/seed.js';

async function start() {
  try {
    await initDb();
    await seedIfEmpty();
    app.listen(config.port, () => {
      console.log(`TechStore API rulează pe http://localhost:${config.port}/api`);
    });
  } catch (err) {
    console.error(`Nu m-am putut conecta la PostgreSQL: ${err.message}`);
    process.exit(1);
  }
}

start();
