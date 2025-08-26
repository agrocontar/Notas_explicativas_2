/*
  Warnings:

  - You are about to drop the column `nome` on the `Company` table. All the data in the column will be lost.
  - Added the required column `name` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "nome",
ADD COLUMN     "name" TEXT NOT NULL;
