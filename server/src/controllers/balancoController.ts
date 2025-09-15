import { handleZodError } from "../utils/handleZodError";
import { NotFoundError } from "../utils/errors";
import * as balancoService from "../services/balancoService"
import z from "zod";
import { Request, Response } from "express";

const balancoSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1),
  group: z.enum(['ATIVO_CIRCULANTE', 'ATIVO_NAO_CIRCULANTE', 'PASSIVO_CIRCULANTE', 'PASSIVO_NAO_CIRCULANTE', 'PATRIMONIO_LIQUIDO']),
  accountingAccounts: z.array(z.string().min(1)).min(1)
});


export const createBalanco = async (req: Request, res: Response) => {
  try {
    const parsed = balancoSchema.parse(req.body);
    const result = await balancoService.createBalanco(parsed)

    res.json({ success: true, result:result });
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
