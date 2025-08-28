/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."BalanceteData" (
    "id" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "accountingAccount" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "previousBalance" DECIMAL(20,2) NOT NULL,
    "debit" DECIMAL(20,2) NOT NULL,
    "credit" DECIMAL(20,2) NOT NULL,
    "monthBalance" DECIMAL(20,2) NOT NULL,
    "currentBalance" DECIMAL(20,2) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "BalanceteData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "public"."Company"("name");

-- AddForeignKey
ALTER TABLE "public"."BalanceteData" ADD CONSTRAINT "BalanceteData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
