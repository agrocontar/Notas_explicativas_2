/*
  Warnings:

  - A unique constraint covering the columns `[companyId,accountingAccount]` on the table `ConfigCompany` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."ConfigTemplate" (
    "id" SERIAL NOT NULL,
    "accountingAccount" VARCHAR(10) NOT NULL,
    "accountName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfigCompany_companyId_accountingAccount_key" ON "public"."ConfigCompany"("companyId", "accountingAccount");
