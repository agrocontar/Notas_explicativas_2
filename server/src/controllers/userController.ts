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
  password: z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" }).optional()

})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" })
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
    const { email, password } = loginSchema.parse(req.body)
    const result = await userService.loginUser(email, password)

    // Send token in cookies
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1h
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: handleZodError(err) });
    }
    res.status(400).json({ error: err instanceof Error ? err.message : err })
  }
}


export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logout realizado com sucesso" });
};


export const refreshUserToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Refresh token não fornecido" });

    const newToken = userService.refreshToken(token);

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.json({ message: "Token renovado" });
  } catch (err) {
    res.status(401).json({ error: err instanceof Error ? err.message : err });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const parsed = updateUserSchema.parse(req.body)

    const updatedUser = await userService.updateUser({...parsed, userId: id});
    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}