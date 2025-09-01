-- DropForeignKey
ALTER TABLE "public"."BalanceteData" DROP CONSTRAINT "BalanceteData_companyId_fkey";

-- AddForeignKey
ALTER TABLE "public"."BalanceteData" ADD CONSTRAINT "BalanceteData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
