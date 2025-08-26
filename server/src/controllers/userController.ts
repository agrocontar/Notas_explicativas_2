import { Request, Response } from "express";
import { z } from "zod";
import * as userService from "../services/userServices";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = userSchema.parse(req.body);
    const user = await userService.createUser(data);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};
