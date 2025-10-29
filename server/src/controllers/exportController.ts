// src/controllers/exportController.ts
import { Request, Response } from 'express';
import { ExportService } from '../services/exportService';

const exportService = new ExportService();

export const exportNotasToWord = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ error: 'companyId é obrigatório' });
    }

    const buffer = await exportService.exportNotasToWord(companyId, res);
    res.send(buffer);
    
  } catch (error: any) {
    console.error('Erro no controller de exportação:', error);
    
    if (error.message === 'Nenhuma nota encontrada para exportação') {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Erro interno ao exportar notas' });
  }
};