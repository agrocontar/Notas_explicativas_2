import z from "zod";
import * as configService from '../services/configCompanyServices'
import { Request, Response } from "express";
import { handleZodError } from "../utils/handleZodError";
import { NotFoundError } from "../utils/errors";

const configSchema = z.object({
  companyId: z.string(),
  configs: z.object({
    accountingAccount: z.string().max(10, 'Codigo da conta deve conter no máximo 10 caracteres!'),
    accountName: z.string(),
  }).array()
});


export const createConfig = async (req: Request, res: Response) => {
  try {
    const parsed = configSchema.parse(req.body);
    const result = await configService.createConfig(parsed)

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(err) });
      }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar Configuração" });
  }
};


export const listConfigs = async (_: Request, res: Response) => {
  try {
    const configs = await configService.listConfigCompanies()

    res.json(configs);
  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(err) });
      }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao Listar Configurações" });
  }
};


