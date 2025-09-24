import { handleZodError } from "../utils/handleZodError";
import { NotFoundError } from "../utils/errors";
import * as dreService from "../services/dreService"
import * as balanceteService from "../services/balanceteService"
import z from "zod";
import { Request, Response } from "express";
import { BalanceteData } from "@prisma/client";

const listDreTotalQuerySchema = z.object({
  companyId: z.string().uuid('ID da empresa inválido'),
  year: z.coerce.number().int('Ano deve ser um número inteiro').min(2000).max(2100)
});


export const listDreTotal = async (req: Request, res: Response) => {

  try{
    const parsed = listDreTotalQuerySchema.parse(req.query);
    const { companyId, year } = parsed;
    const result = await dreService.listDreWithTotals({companyId, year})
    const totalImpostos = await balanceteService.listBalanceEspecific(companyId, year, '434') as BalanceteData
    const despesaOperacionalfirst = await balanceteService.listBalanceEspecific(companyId, year, '4.2') as BalanceteData
    const despesaOperacionalsecond = await balanceteService.listBalanceEspecific(companyId, year, '4.3.3') as BalanceteData
    const resultadoFinanceiro = await balanceteService.listBalanceEspecific(companyId, year, '4.3.1') as BalanceteData
    const receitaLiquida = await balanceteService.listBalanceEspecific(companyId, year, '3.1') as BalanceteData
    const custos = await balanceteService.listBalanceEspecific(companyId, year, '4.1') as BalanceteData

    if (!totalImpostos || !despesaOperacionalfirst || !despesaOperacionalsecond || !resultadoFinanceiro || !receitaLiquida || !custos) {
      throw new NotFoundError('Dados insuficientes para calcular DRE total');
    }
      const despesaOperacional = {
        currentBalance: despesaOperacionalfirst.currentBalance.add(despesaOperacionalsecond.currentBalance),
        previousBalance: despesaOperacionalfirst.previousBalance.add(despesaOperacionalsecond.previousBalance)
      }

 
    
    res.json(
      { 
        despesaOperacional: despesaOperacional,
        totalImpostos: totalImpostos,
        resultadoFinanceiro: resultadoFinanceiro,
        receitaLiquida: receitaLiquida,
        custos: custos, 
        dre: result
      }
    )
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