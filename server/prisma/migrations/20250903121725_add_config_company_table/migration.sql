/*
  Warnings:

  - You are about to alter the column `accountingAccount` on the `BalanceteData` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "public"."BalanceteData" ALTER COLUMN "accountingAccount" SET DATA TYPE VARCHAR(10);

-- CreateTable
CREATE TABLE "public"."ConfigCompany" (
    "id" SERIAL NOT NULL,
    "accountingAccount" VARCHAR(10) NOT NULL,
    "accountName" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ConfigCompany_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ConfigCompany" ADD CONSTRAINT "ConfigCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
