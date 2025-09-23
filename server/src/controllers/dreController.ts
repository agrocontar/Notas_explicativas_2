import { handleZodError } from "../utils/handleZodError";
import { NotFoundError } from "../utils/errors";
import * as dreService from "../services/dreService"
import z from "zod";
import { Request, Response } from "express";

const listDreTotalQuerySchema = z.object({
  companyId: z.string().uuid('ID da empresa inválido'),
  year: z.coerce.number().int('Ano deve ser um número inteiro').min(2000).max(2100)
});


export const listBalancoTotal = async (req: Request, res: Response) => {

  try{
    const parsed = listDreTotalQuerySchema.parse(req.query);
    const { companyId, year } = parsed;
    const result = await dreService.listDreWithTotals({companyId, year})
    
    res.json(result)
  }catch(error){
    if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(error) });
      }
      if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao listar DRE" });
  }
}