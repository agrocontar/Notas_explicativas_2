import { Request, Response } from "express";
import * as configService from '../../services/mapping/configTemplateServices'
import { handleZodError } from "../../utils/handleZodError";
import { NotFoundError } from "../../utils/errors";
import z from "zod";



export const listConfigTemplate = async (req: Request, res: Response) => {
  try {

    const configs = await configService.listConfigTemplate()

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
