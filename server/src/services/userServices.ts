import { prisma } from "../prismaClient";
import bcrypt from "bcrypt"


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
  role?: 'Admin' | 'Coordenador' | 'Colaborador';
}




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



export const updateUser = async ({userId, email, name, password, role}: UpdateUserInput) => {

  if(!email && !name && !password && !role) throw new Error('Sem dados para atualizar')

  const user = await prisma.user.findFirst({where: {id: userId}})
  if (!user) throw new Error('Usuário nao existe!')

  const data: any = {}

    if (name) data.name = name;
    if (email) data.email = email;
    if (role) data.role = role;
    if(password){
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword
    }


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