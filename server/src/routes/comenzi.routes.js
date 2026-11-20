import { Router } from 'express';
import * as controller from '../controllers/comenzi.controller.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.patch('/:id/status', controller.updateStatus);

export default router;
