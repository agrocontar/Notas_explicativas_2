import z from "zod";
import * as authService from "../services/authServices";
import { Request, Response } from "express";
import { handleZodError } from "../utils/handleZodError";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" })
})

export const login = async (req: Request, res: Response) => {

  try {
    const { email, password } = loginSchema.parse(req.body)
    const result = await authService.login(email, password)

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


export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logout realizado com sucesso" });
};


export const refreshUserToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Refresh token não fornecido" });

    const newToken = authService.refreshToken(token);

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
