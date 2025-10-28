import { Request, Response } from 'express';
import * as tabelaDemonstrativaService from '../services/tbDemoServices';

class TabelaDemonstrativaController {
  async getByNota(req: Request, res: Response) {
    try {
      const { notaId } = req.params;
      const tabelas = await tabelaDemonstrativaService.getTabelasByNota(notaId);
      return res.json(tabelas);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { notaId } = req.params;
      const { conta, anoAnterior, anoAtual, ordem } = req.body;
      
      const tabela = await tabelaDemonstrativaService.createTabela(notaId, {
        conta,
        anoAnterior: anoAnterior !== null ? parseFloat(anoAnterior) : null,
        anoAtual: anoAtual !== null ? parseFloat(anoAtual) : null,
        ordem: parseInt(ordem)
      });

      return res.status(201).json(tabela);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { conta, anoAnterior, anoAtual, ordem } = req.body;
      
      const tabela = await tabelaDemonstrativaService.updateTabela(id, {
        conta,
        anoAnterior: anoAnterior !== undefined ? parseFloat(anoAnterior) : undefined,
        anoAtual: anoAtual !== undefined ? parseFloat(anoAtual) : undefined,
        ordem: ordem !== undefined ? parseInt(ordem) : undefined
      });

      return res.json(tabela);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await tabelaDemonstrativaService.deleteTabela(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const { notaId } = req.params;
      const { novasOrdens } = req.body;
      
      const result = await tabelaDemonstrativaService.reorderTabelas(notaId, novasOrdens);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new TabelaDemonstrativaController();