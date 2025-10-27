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