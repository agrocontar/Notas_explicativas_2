// src/controllers/balancete.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import * as balanceteService from '../services/balanceteService'
import { handleZodError } from "../utils/handleZodError";
import { NotFoundError } from "../utils/errors";


const listBalancetePerYearSchema = z.object({
  year: z.number(),
  companyId: z.string()
})

const listBalanceEspecificSchema = z.object({
  companyId: z.string().uuid(),
  year: z.coerce.number(), // coerce para converter string para number
  accounting: z.string().min(1)
});


const balanceteSchema = z.object({
  companyId: z.string().uuid(),
  referenceDate: z.number(),
  balanceteData: z.array(
    z.object({
      accountingAccount: z.string(),
      accountName: z.string(),
      previousBalance: z.number(),
      debit: z.number(),
      credit: z.number(),
      monthBalance: z.number(),
      currentBalance: z.number(),
    })
  ),
});

export const createBalanceteController = async (req: Request, res: Response) => {
  try {
    const parsed = balanceteSchema.parse(req.body);
    const result = await balanceteService.createBalancete(parsed);

    res.json({ success: true, inserted: result.count });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar balancete" });
  }
};

export const listBalancetePerYear = async (req: Request, res: Response) => {

  try {
    const parsed = listBalancetePerYearSchema.parse(req.body)
    const result = await balanceteService.listBalancetePerYear(parsed)

    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao listar balancete" });
    
  }
}



export const listBalancetesCompany = async (req: Request, res: Response) => {

  try{
    const {companyId} = req.params
    const result = await balanceteService.listBalancetesCompany(companyId)

    res.json(result)
  }catch(error){
    if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao listar balancete" });
  }
}

export const listContasBalancete = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    
    if (!companyId) {
      return res.status(400).json({ error: "companyId é obrigatório" });
    }

    const result = await balanceteService.listContasUnicasBalancete(companyId);
    res.json(result);
  } catch (error) {
    console.error('Erro ao listar contas do balancete:', error);
    res.status(500).json({ error: "Erro ao listar contas do balancete" });
  }
};



export const listBalanceEspecific = async (req: Request, res: Response) => {
  try {
    // Valida os parâmetros da rota
    const parsed = listBalanceEspecificSchema.parse({
      companyId: req.params.companyId,
      year: req.params.year,
      accounting: req.params.accounting
    });

    // Chama o service
    const result = await balanceteService.listBalanceEspecific(
      parsed.companyId,
      parsed.year,
      parsed.accounting
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(error) });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao buscar balancete específico:', error);
    res.status(500).json({ error: "Erro ao buscar balancete específico" });
  }
};