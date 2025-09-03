/*
  Warnings:

  - You are about to drop the column `systemAccountId` on the `ConfigMapping` table. All the data in the column will be lost.
  - Added the required column `defaultAccountId` to the `ConfigMapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ConfigMapping" DROP CONSTRAINT "ConfigMapping_systemAccountId_fkey";

-- AlterTable
ALTER TABLE "public"."ConfigMapping" DROP COLUMN "systemAccountId",
ADD COLUMN     "defaultAccountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ConfigMapping" ADD CONSTRAINT "ConfigMapping_defaultAccountId_fkey" FOREIGN KEY ("defaultAccountId") REFERENCES "public"."ConfigTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
