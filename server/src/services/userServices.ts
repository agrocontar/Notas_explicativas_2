import { prisma } from "../prismaClient";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (data: CreateUserInput) => {
  
  return prisma.user.create({ data });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};