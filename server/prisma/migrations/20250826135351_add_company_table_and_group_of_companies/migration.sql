-- CreateTable
CREATE TABLE "public"."GroupCompanies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_UserGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_CompanyGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserGroup_B_index" ON "public"."_UserGroup"("B");

-- CreateIndex
CREATE INDEX "_CompanyGroup_B_index" ON "public"."_CompanyGroup"("B");

-- AddForeignKey
ALTER TABLE "public"."_UserGroup" ADD CONSTRAINT "_UserGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."GroupCompanies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserGroup" ADD CONSTRAINT "_UserGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyGroup" ADD CONSTRAINT "_CompanyGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyGroup" ADD CONSTRAINT "_CompanyGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."GroupCompanies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
