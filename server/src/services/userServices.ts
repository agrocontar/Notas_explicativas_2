import { email } from "zod";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  userId: string
  name?: string,
  email?: string,
  password?: string

}

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

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
    {userId: user.id, email: user.email, role: user.role},
    JWT_SECRET,
    {expiresIn: "1h"}
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
    const newToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: "1h" });
    return newToken;
  } catch {
    throw new Error("Refresh token inválido");
  }
};



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



export const updateUser = async ({userId, email, name, password}: UpdateUserInput) => {

  if(!email && !name && !password) throw new Error('Sem dados para atualizar')

  const user = await prisma.user.findFirst({where: {id: userId}})
  if (!user) throw new Error('Usuário nao existe!')

  const data: any = {}

    if (name) data.name = name;
    if (password) data.password = password;
    if (email) data.email = email;


  const updateUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return updateUser

}

export const deleteUser = async (userId: string) => {

  if (!userId) throw new Error('Id de Usuario não enviado!')

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Usuário não encontrado!')

  await prisma.user.delete({ where: { id: userId } })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }
}