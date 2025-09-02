import jwt from "jsonwebtoken"
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt"


const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Login
export const login = async (email: string, password: string) => {

  // user not found
  const user = await prisma.user.findUnique({where: {email}})
  if (!user) throw new Error("Usuário não encontrado!")

  // invalid password
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error("Senha Inválida")
  
  // Generate token
  const token = jwt.sign(
    {userId: user.id, email: user.email, role: user.role},
    JWT_SECRET,
    {expiresIn: "6h"}
  )

  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  
  return {token, refreshToken, user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }}
  
}


// generate new RefreshToken
export const refreshToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    const newToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: "6h" });
    return newToken;
  } catch {
    throw new Error("Refresh token inválido");
  }
};
