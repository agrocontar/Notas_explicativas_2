import z from "zod";
import * as mappingService from '../../services/mapping/configMappingServices'
import { Request, Response } from "express";
import { handleZodError } from "../../utils/handleZodError";
import { NotFoundError } from "../../utils/errors";

const configSchema = z.object({
  companyId: z.string(),
  companyAccount: z.string(),
  defaultAccountId: z.number(),
});


export const createMapping = async (req: Request, res: Response) => {
  try {
    const parsed = configSchema.parse(req.body);
    const result = await mappingService.createMappingCompany(parsed)

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



export const listMappingCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id
    const configs = await mappingService.listMappingCompany(companyId)

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


export const updateMappingCompany = async (req: Request, res: Response) => {
  try {
    const parsed = configSchema.parse(req.body);
    const mappingId = Number(req.params.id)
    if (isNaN(mappingId)) {
      res.status(400).json({error: "ID inválido, precisa ser numérico!"}) 
      return
    }
    const result = await mappingService.updateMappingCompany({...parsed, mappingId})

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


export const deleteMappingCompany = async (req: Request, res: Response) => {
  try {
    const mappingId = Number(req.params.id)
    if (isNaN(mappingId)) {
      res.status(400).json({error: "ID inválido, precisa ser numérico!"}) 
      return
    }
    const result = await mappingService.deleteMappingCompany(mappingId)

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: handleZodError(err) });
      }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar Mapeamento" });
  }
}


const bulkMappingSchema = z.object({
  companyId: z.string().uuid(),
  mappings: z.array(z.object({
    companyAccount: z.string(),
    defaultAccount: z.string(),
  }))
});

export const createBulkMappingsController = async (req: Request, res: Response) => {
  try {
    const parsed = bulkMappingSchema.parse(req.body);
    const result = await mappingService.createBulkMappings(parsed);

    res.json({
      success: true,
      summary: {
        total: parsed.mappings.length,
        success: result.success.length,
        errors: result.errors.length,
        skipped: result.skipped.length
      },
      details: result
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao criar mapeamentos em massa" });
  }
};





const deleteMultipleMappingsSchema = z.object({
  mappingIds: z.array(z.number()).min(1, "Pelo menos um ID de mapeamento deve ser fornecido")
});

export const deleteMultipleMappings = async (req: Request, res: Response) => {
  try {
    const { mappingIds } = deleteMultipleMappingsSchema.parse(req.body);
    
    const result = await mappingService.deleteMultipleMappings(mappingIds);

    res.json({
      message: `${result.count} mapeamento(s) deletado(s) com sucesso`,
      deletedCount: result.count
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar Mapeamentos" });
  }
};