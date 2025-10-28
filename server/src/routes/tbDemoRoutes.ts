import { Router } from 'express';
import TabelaDemonstrativaController from '../controllers/tbDemoController';

const router = Router();

router.get('/nota/:notaId/tabelas', TabelaDemonstrativaController.getByNota);
router.post('/nota/:notaId/tabelas', TabelaDemonstrativaController.create);
router.put('/tabelas/:id', TabelaDemonstrativaController.update);
router.delete('/tabelas/:id', TabelaDemonstrativaController.delete);
router.put('/nota/:notaId/tabelas/reorder', TabelaDemonstrativaController.reorder);

export default router;