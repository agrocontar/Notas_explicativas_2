/*
  Warnings:

  - You are about to drop the `Balanco` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Balanco" DROP CONSTRAINT "Balanco_companyId_fkey";

-- DropTable
DROP TABLE "public"."Balanco";

-- CreateTable
CREATE TABLE "public"."BalancoTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "group" "public"."BalancoGroup" NOT NULL,
    "accountingAccounts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BalancoTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BalancoTemplate_group_idx" ON "public"."BalancoTemplate"("group");
