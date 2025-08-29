/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `referenceDate` on the `BalanceteData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `cnpj` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Company_name_key";

-- AlterTable
ALTER TABLE "public"."BalanceteData" DROP COLUMN "referenceDate",
ADD COLUMN     "referenceDate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "cnpj" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "BalanceteData_companyId_referenceDate_idx" ON "public"."BalanceteData"("companyId", "referenceDate");

-- CreateIndex
CREATE INDEX "BalanceteData_referenceDate_idx" ON "public"."BalanceteData"("referenceDate");

-- CreateIndex
CREATE INDEX "BalanceteData_accountingAccount_idx" ON "public"."BalanceteData"("accountingAccount");

-- CreateIndex
CREATE INDEX "BalanceteData_companyId_accountingAccount_referenceDate_idx" ON "public"."BalanceteData"("companyId", "accountingAccount", "referenceDate");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "public"."Company"("cnpj");
