import { Request, Response } from "express";
import { email, z } from "zod";
import * as userService from "../services/userServices";
import { handleZodError } from "../utils/handleZodError";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" }),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" }).optional(),
  role: z.enum(['Admin', 'Coordenador', 'Colaborador']).optional()
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



export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const parsed = updateUserSchema.parse(req.body)

    const updatedUser = await userService.updateUser({...parsed, userId: id});
    res.json(updatedUser);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}

export const deleteUser = async (req: Request, res: Response) => {

  try{
    const {id} = req.params
    if (!id){
      res.json({message: 'Id não enviado'})
    }

    const deletedUser = await userService.deleteUser(id)
    if(!deletedUser) return res.json({message: "Usuário não encontrado"})
    
    res.json({message: "Usuario deletado com sucesso!"})

  }catch (err){
    res.status(401).json({ error: err instanceof Error ? err.message : err });
  }
}


