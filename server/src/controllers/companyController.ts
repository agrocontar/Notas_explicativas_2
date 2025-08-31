import z from "zod";
import * as companyService from '../services/companyServices'
import { handleZodError } from "../utils/handleZodError";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const companySchema = z.object({
  name: z.string(),
  cnpj: z.string()
})

const updateCompanySchema = z.object({
  name: z.string().optional(),
  cnpj: z.string().optional()
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

export const listCompanies = async (_: Request, res: Response) => {
  const companies = await companyService.listCompanies()
  res.json(companies)
}

export const listUserCompanies = async (req: Request, res: Response) => {

  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    const groupCompanies = await companyService.listUserCompanies(decoded.userId)

    res.json(groupCompanies)

  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });

  }
}


export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const parsed = updateCompanySchema.parse(req.body)

    const updatedCompany = await companyService.updateCompany({...parsed, companyId: id});
    res.json(updatedCompany);
  } catch (err) {
    res.status(401).json({ error: err instanceof Error ? err.message : err });
  }
}