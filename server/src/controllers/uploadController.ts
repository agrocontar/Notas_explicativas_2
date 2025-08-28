// src/controllers/balancete.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import * as uploadServices from '../services/uploadServices'
import { handleZodError } from "../utils/handleZodError";

const balanceteSchema = z.object({
  companyId: z.string().uuid(),
  referenceDate: z.string(),
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

export const createBalancete = async (req: Request, res: Response) => {
  try {
    const parsed = balanceteSchema.parse(req.body);
    const result = await uploadServices.createBalancete(parsed)

    res.json({ success: true, inserted: result.count });
  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(err) });
      }
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar balancete" });
  }
};
