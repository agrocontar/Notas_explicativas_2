import { prisma } from "../../prismaClient";

// List configs template
export const listConfigTemplate = async () => {

  const configs = await prisma.configTemplate.findMany()

  return configs
}
