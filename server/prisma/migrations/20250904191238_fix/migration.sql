-- AddForeignKey
ALTER TABLE "public"."ConfigMapping" ADD CONSTRAINT "ConfigMapping_companyId_companyAccount_fkey" FOREIGN KEY ("companyId", "companyAccount") REFERENCES "public"."ConfigCompany"("companyId", "accountingAccount") ON DELETE RESTRICT ON UPDATE CASCADE;
