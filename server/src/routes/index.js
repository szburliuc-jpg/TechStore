import { Router } from 'express';
import { pool } from '../db/pool.js';
import produseRoutes from './produse.routes.js';
import comenziRoutes from './comenzi.routes.js';
import mesajeRoutes from './mesaje.routes.js';

const router = Router();

router.get('/health', async (req, res) => {
  let baza = 'conectata';
  try {
    await pool.query('SELECT 1');
  } catch {
    baza = 'deconectata';
  }
  res.json({ status: 'ok', service: 'techstore-server', postgres: baza, timp: new Date().toISOString() });
});

router.use('/produse', produseRoutes);
router.use('/comenzi', comenziRoutes);
router.use('/mesaje', mesajeRoutes);

export default router;
