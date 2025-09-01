import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token; 

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string, role: string };
    req.user = decoded;

    next(); 
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};


export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }
  
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: "Acesso negado. Requer permissão de Administrador" });
  }
  
  next();
};

export const requireCoordenador = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }
  
  const allowedRoles = ['Admin', 'Coordenador'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: "Acesso negado. Requer permissão de Coordenador ou superior" });
  }
  
  next();
};