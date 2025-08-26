import { email } from "zod";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Hash the password and create user
export const createUser = async (data: CreateUserInput) => {

  // user not found
  const userExistes = await prisma.user.findUnique({where: {email: data.email}})
  if (userExistes) throw new Error("Usuário com este e-mail já existe!")

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {...data, password: hashedPassword}
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }

};

// List all users
export const getAllUsers = async () => {
  return prisma.user.findMany();
};

// Login
export const loginUser = async (email: string, password: string) => {

  // user not found
  const user = await prisma.user.findUnique({where: {email}})
  if (!user) throw new Error("Usuário não encontrado!")

  // invalid password
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error("Senha Inválida")
  
  // Generate token
  const token = jwt.sign(
    {userId: user.id, email: user.email},
    JWT_SECRET,
    {expiresIn: "1d"}
  )
  
  return {token, user: {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }}
  
}