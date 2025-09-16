-- CreateEnum
CREATE TYPE "public"."BalancoGroup" AS ENUM ('ATIVO_CIRCULANTE', 'ATIVO_NAO_CIRCULANTE', 'PASSIVO_CIRCULANTE', 'PASSIVO_NAO_CIRCULANTE', 'PATRIMONIO_LIQUIDO');

-- CreateTable
CREATE TABLE "public"."Balanco" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" "public"."BalancoGroup" NOT NULL,
    "accountingAccounts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Balanco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Balanco_companyId_idx" ON "public"."Balanco"("companyId");

-- CreateIndex
CREATE INDEX "Balanco_group_idx" ON "public"."Balanco"("group");

-- AddForeignKey
ALTER TABLE "public"."Balanco" ADD CONSTRAINT "Balanco_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
