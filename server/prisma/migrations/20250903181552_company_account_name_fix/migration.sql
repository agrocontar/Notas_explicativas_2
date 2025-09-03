/*
  Warnings:

  - You are about to drop the column `clientAccount` on the `ConfigMapping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId,companyAccount]` on the table `ConfigMapping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyAccount` to the `ConfigMapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."ConfigMapping_companyId_clientAccount_key";

-- AlterTable
ALTER TABLE "public"."ConfigMapping" DROP COLUMN "clientAccount",
ADD COLUMN     "companyAccount" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConfigMapping_companyId_companyAccount_key" ON "public"."ConfigMapping"("companyId", "companyAccount");
