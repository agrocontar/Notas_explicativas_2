import { Request, Response } from "express";
import * as groupService from "../services/groupCompaniesServices";
import z from "zod";
import { handleZodError } from "../utils/handleZodError";

const groupCompanySchema = z.object({
  name: z.string(),
  companyIds: z.string().array()
})

// Create Groups Companys
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, companyIds } = groupCompanySchema.parse(req.body);
    const group = await groupService.createGroupCompanies({ name, companyIds });
    res.json(group);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};

//List Groups
export const listGroups = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.listGroups();
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.id;
    const { name, companyIds, userIds } = req.body;

    const updatedGroup = await groupService.updateGroup({ groupId, name, companyIds, userIds });
    res.json(updatedGroup);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }

}

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.id;
    if(!groupId) res.status(400).json({message: "Parametro não enviado"})

    const deletedGroup = groupService.deleteGroup(groupId)
    res.json(deletedGroup);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }

}