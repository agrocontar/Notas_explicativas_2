import { Router } from 'express';
import * as TabelaDemonstrativaController from '../controllers/demoTableController';

const router = Router();

router.get('/:notaId', TabelaDemonstrativaController.getByNota);
router.post('/:notaId', TabelaDemonstrativaController.create);
router.put('/:id', TabelaDemonstrativaController.update);
router.delete('/:id', TabelaDemonstrativaController.deleteDemoTable);
router.put('/:notaId/reorder', TabelaDemonstrativaController.reorder);

export default router;