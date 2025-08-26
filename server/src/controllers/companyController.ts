import z from "zod";
import * as companyService from '../services/companyServices'
import { handleZodError } from "../utils/handleZodError";
import { Request, Response } from "express";

const companySchema = z.object({
  name: z.string()
})

export const createCompany = async (req: Request, res: Response) => {

  try {

    const data = companySchema.parse(req.body)
    const company = await companyService.createCompany(data)
    res.json(company)

  } catch (err) {

    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}

export const listCompanies = async(_: Request, res: Response)=> {
  const companies = await companyService.listCompanies()
  res.json(companies)
}