import { prisma } from "../prismaClient";

interface CreateGroupCompaniesInput {
  name: string
  companyIds: string[]; 
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