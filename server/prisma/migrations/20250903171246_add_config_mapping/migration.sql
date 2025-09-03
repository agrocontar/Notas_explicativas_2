-- CreateTable
CREATE TABLE "public"."ConfigMapping" (
    "id" SERIAL NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientAccount" TEXT NOT NULL,
    "systemAccountId" INTEGER NOT NULL,

    CONSTRAINT "ConfigMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfigMapping_companyId_clientAccount_key" ON "public"."ConfigMapping"("companyId", "clientAccount");

-- AddForeignKey
ALTER TABLE "public"."ConfigMapping" ADD CONSTRAINT "ConfigMapping_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConfigMapping" ADD CONSTRAINT "ConfigMapping_systemAccountId_fkey" FOREIGN KEY ("systemAccountId") REFERENCES "public"."ConfigTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
