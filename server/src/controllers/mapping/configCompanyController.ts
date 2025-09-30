import z from "zod";
import * as configService from '../../services/mapping/configCompanyServices'
import { Request, Response } from "express";
import { handleZodError } from "../../utils/handleZodError";
import { ConflictError, NotFoundError } from "../../utils/errors";

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
    if (err instanceof ConflictError) {
      return res.status(409).json({
        error: 'Conflito',
        message: err.message
      });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar Configuração" });
  }
};



export const listConfigCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id
    const configs = await configService.listConfigCompany(companyId)

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


export const updateConfigCompany = async (req: Request, res: Response) => {
  try {
    const parsed = configSchema.parse(req.body);
    const result = await configService.updateConfigCompany(parsed)

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(err) });
      }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao editar Configurações" });
  }
};

export const deleteConfigCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const accountingAccounts: string[] = req.body.accountingAccounts;

    if (!Array.isArray(accountingAccounts) || accountingAccounts.length === 0) {
      return res.status(400).json({ error: "accountingAccounts deve ser um array não vazio." });
    }

    const result = await configService.deleteConfigsCompany(companyId, accountingAccounts);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar Configurações" });
  }
};



export const deleteConfigNotMappedOfCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id
    const result = await configService.deleteConfigNotMappedOfCompany(companyId)
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(err) });
      }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar Configurações não mapeadas" });
  }
};