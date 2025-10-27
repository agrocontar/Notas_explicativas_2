import { prisma } from "../prismaClient"

export interface createNotaInput {
  companyId: string
  number: number
  title: string
  content: string
}

export interface updateNotaInput {
  notaId: string
  title?: string
  content?: string
}

export const createNota = async (data: createNotaInput) => {

  const companyExists = await prisma.company.findFirst({ where: { id: data.companyId } })
  if (!companyExists) throw new Error('Empresa não encontrada!')

  const nota = await prisma.nota.create({ data })
  return nota
}

// List Notas
export const listNotas = async () => {
  return prisma.nota.findMany()
}

export const updateNota = async ({ notaId, title, content }: updateNotaInput) => {
  if (!notaId) throw new Error("Id da nota não informado");

  const nota = await prisma.nota.findUnique({
    where: { id: notaId }
  });

  if (!nota) throw new Error("Nota não encontrada");

  // verify if cnpj is active
  if (cnpj && company.cnpj !== cnpj) {

    const existingCompanyWithCnpj = await prisma.company.findFirst({
      where: {
        cnpj: cnpj,
        id: { not: companyId } // Except the current company
      }
    });

    if (existingCompanyWithCnpj) {
      throw new Error("CNPJ já está sendo utilizado por outra empresa");
    }
  }

  const data: any = {};

  if (cnpj) data.cnpj = cnpj;
  if (name) data.name = name;


  if (Object.keys(data).length === 0) {
    return company;
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data
  });

  return updatedCompany;
};

export const deleteCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new Error('Empresa não encontrada!')

  await prisma.company.delete({ where: { id: companyId } })

  return {
    id: company.id,
    name: company.name,
    cnpj: company.cnpj,
    createdAt: company.createdAt
  }
}