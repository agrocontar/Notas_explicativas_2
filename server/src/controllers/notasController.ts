import { Request, Response } from "express";
import z, { number } from "zod";
import { handleZodError } from "../utils/handleZodError";

import * as notasService from "../services/notasServices";


const notasSchema = z.object({
  companyId: z.string().uuid(),
  number: z.number().int().positive(),
  title: z.string(),
  content: z.string(),
});

const updateNotasSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().optional(),
  content: z.string().optional(),
});

export const createNota = async (req: Request, res: Response) => {
  try {
    const { companyId, number, title, content } = notasSchema.parse(req.body);
    const nota = await notasService.createNota({ companyId, number, title, content });
    res.json(nota);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}
export const reorder = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { novasOrdens } = req.body;

    if (!novasOrdens || !Array.isArray(novasOrdens)) {
      return res.status(400).json({ error: 'Lista de novas ordens é obrigatória' });
    }

    // Valida se os números são sequenciais e únicos
    const numbers = novasOrdens.map(item => item.number);
    const uniqueNumbers = [...new Set(numbers)];
    
    if (uniqueNumbers.length !== numbers.length) {
      return res.status(400).json({ error: 'Números de nota devem ser únicos' });
    }

    // Verifica se os números são sequenciais começando de 1
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const isSequential = sortedNumbers.every((num, index) => num === index + 1);
    
    if (!isSequential) {
      return res.status(400).json({ error: 'Números de nota devem ser sequenciais começando de 1' });
    }

    // Usa a estratégia com números temporários (mais robusta)
    const result = await notasService.reorderNotas(companyId, novasOrdens);
    
    return res.json(result);
  } catch (error: any) {
    console.error('Erro no controller de reordenar notas:', error);
    return res.status(400).json({ error: error.message });
  }
}

export const updateNota = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const { number, title, content } = updateNotasSchema.parse(req.body);
    const notaAtualizada = await notasService.updateNota(companyId, number, { title, content });
    res.json(notaAtualizada);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};

export const deleteNota = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const number =  parseInt(req.params.number, 10);
    await notasService.deleteNota(companyId, number);
    res.json({ message: 'Nota deletada com sucesso' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};

export const listNotasByEmpresa = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const notas = await notasService.listNotasByEmpresa(companyId);
    res.json(notas);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}