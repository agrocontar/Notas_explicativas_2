import { Prisma } from "@prisma/client";
import { prisma } from "../../prismaClient";
import { ConflictError, NotFoundError } from "../../utils/errors";
import { normalizeAccountingAccount } from "../../utils/normalizeAccountingAccount";

interface createConfigInput {
  companyId: string
  configs: {
    accountingAccount: string,
    accountName: string,
  }[]
}

// Create Config with json
export const createConfig = async (data: createConfigInput) => {
  const company = await prisma.company.findUnique({ where: { id: data.companyId } });
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!");

  try {
    const config = await prisma.configCompany.createMany({
      data: data.configs.map((row) => ({
        companyId: data.companyId,
        accountingAccount: normalizeAccountingAccount(row.accountingAccount),
        accountName: row.accountName
      })),
    });

    return config;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Extrair qual conta causou o problema
        const existingAccount = await prisma.configCompany.findFirst({
          where: {
            companyId: data.companyId,
            accountingAccount: {
              in: data.configs.map(row => normalizeAccountingAccount(row.accountingAccount))
            }
          }
        });

        if (existingAccount) {
          throw new ConflictError(`Já existe uma conta com o código '${existingAccount.accountingAccount}' para esta empresa.`);
        }
        
        throw new ConflictError("Já existe uma conta com esses dados para esta empresa.");
      }
    }
    throw error;
  }
};


// List configs of a company that are not yet mapped
export const listConfigCompany = async (companyId: string) => {

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  const unmappedConfigs = await prisma.configCompany.findMany({
    where: {
      companyId,
      // Filtra apenas as configurações que não têm mapeamento
      ConfigMapping: {
        none: {} // Nenhum mapeamento relacionado existe
      }
    },
    include: {
      // Inclui informações adicionais se necessário
      company: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return unmappedConfigs
}

//update configs of a company
export const updateConfigCompany = async (data: createConfigInput) => {

  const company = await prisma.company.findUnique({ where: { id: data.companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  const accounts = data.configs.map(c => c.accountingAccount)
  const duplicates = accounts.filter((item, idx) => accounts.indexOf(item) !== idx)

  if (duplicates.length > 0) {
    throw new NotFoundError(`Existe contas com o mesmo codigo na lista, codigos: ${[...new Set(duplicates)].join(', ')}`)
  }

  // delete all current configs of company
  await prisma.configCompany.deleteMany({
    where: { companyId: data.companyId }
  })

  // create new configs
  const configs = await prisma.configCompany.createMany({
    data: data.configs.map((row) => ({
      companyId: data.companyId,
      accountingAccount: normalizeAccountingAccount(row.accountingAccount),
      accountName: row.accountName,
    }))
  })

  return configs
}


export const deleteConfigsCompany = async (companyId: string, accountingAccounts: string[]) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!");

  if (!accountingAccounts || accountingAccounts.length === 0) {
    throw new NotFoundError("Nenhuma conta contábil fornecida para exclusão!");
  }

  // Normaliza todas as contas antes de buscar/deletar
  const normalizedAccounts = accountingAccounts.map(normalizeAccountingAccount);

  // Verifica se todas as contas existem para a empresa
  const existingConfigs = await prisma.configCompany.findMany({
    where: {
      companyId,
      accountingAccount: { in: normalizedAccounts }
    }
  });

  const notFoundAccounts = normalizedAccounts.filter(
    acc => !existingConfigs.some(cfg => cfg.accountingAccount === acc)
  );

  if (notFoundAccounts.length > 0) {
    throw new NotFoundError(`Configuração(ões) não encontrada(s) nessa empresa: ${notFoundAccounts.join(', ')}`);
  }

  // Deleta todas as configs encontradas
  const deleted = await prisma.configCompany.deleteMany({
    where: {
      companyId,
      accountingAccount: { in: normalizedAccounts }
    }
  });

  return { message: "Configurações deletadas com sucesso!", deletedCount: deleted.count };
}

export const deleteConfigNotMappedOfCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")
  const deletedConfigs = await prisma.configCompany.deleteMany({
    where: {
      companyId,
      // Filtra apenas as configurações que não têm mapeamento
      ConfigMapping: {
        none: {} // Nenhum mapeamento relacionado existe
      }
    }
  })

  return deletedConfigs
}
