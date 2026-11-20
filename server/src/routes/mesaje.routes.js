import { Router } from 'express';
import * as controller from '../controllers/mesaje.controller.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', controller.create);

export default router;
