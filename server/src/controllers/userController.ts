import { Request, Response } from "express";
import { email, z } from "zod";
import * as userService from "../services/userServices";
import { handleZodError } from "../utils/handleZodError";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, {message: "Senha deve ter no minimo 6 caracteres"}),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {message: "Senha deve ter no minimo 6 caracteres"})
})

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = userSchema.parse(req.body);
    const user = await userService.createUser(data);
    res.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};



export const getUsers = async (_: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};




export const loginUser = async (req: Request, res: Response) => {

  try {
    const data = loginSchema.parse(req.body)
    const result = await userService.loginUser(data.email, data.password)
    res.json(result)
  }catch(err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({error: err instanceof Error ? err.message : err})
  }
}