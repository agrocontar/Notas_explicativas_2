import { prisma } from "../prismaClient";

interface CreateGroupCompaniesInput {
  name: string
  companyIds: string[]; 
}

interface UpdateGroupCompaniesInput {
  groupId: string
  name?: string
  companyIds?: string[]
  userIds?: string[]
}

//Create Group of Companies
export const createGroupCompanies = async (data: CreateGroupCompaniesInput) => {

  const group = await prisma.groupCompanies.create({
    data: {
      name: data.name,
      companies: {
        connect: data.companyIds.map(id => ({ id })),
      },
    },
    include: { companies: true }, 
  });

  return group;
}

// List groups
export const listGroups = async () => {
  return prisma.groupCompanies.findMany({
    include: { companies: true },
  });
};

//Atribute user to group
export const updateGroup = async ({ userIds, companyIds, name, groupId }: UpdateGroupCompaniesInput) => {
  const group = await prisma.groupCompanies.findUnique({ where: { id: groupId } });
  if (!group) throw new Error('Grupo inexistente');

  if (!userIds && !companyIds && !name) throw new Error('Sem dados para atualizar');

  const data: any = {};

  if (name) data.name = name;
  if (companyIds) {
    data.companies = {
      set: [], // Remove all current company
      connect: companyIds.map(id => ({ id }))
    };
  }
  if (userIds) {
    data.users = {
      set: [], // Remove all current users
      connect: userIds.map(id => ({ id }))
    };
  }

  const updatedGroup = await prisma.groupCompanies.update({
    where: { id: groupId },
    data,
    include: { companies: true, users: true }
  });

  return updatedGroup;
}