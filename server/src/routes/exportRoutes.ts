// src/routes/exportRoutes.ts
import { Router } from 'express';
import * as exportController from '../controllers/exportController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/:companyId/word', authMiddleware, exportController.exportNotasToWord);

export default router;