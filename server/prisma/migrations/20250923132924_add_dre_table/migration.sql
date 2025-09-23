-- CreateEnum
CREATE TYPE "public"."DreGroup" AS ENUM ('RECEITAS_LIQUIDAS', 'CUSTOS', 'DESPESAS_OPERACIONAIS', 'RESULTADO_FINANCEIRO', 'IMPOSTOS');

-- CreateTable
CREATE TABLE "public"."DreTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "group" "public"."DreGroup" NOT NULL,
    "accountingAccounts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DreTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DreTemplate_group_idx" ON "public"."DreTemplate"("group");
