-- CreateTable
CREATE TABLE "public"."NotasExplicativas" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotasExplicativas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotasExplicativas_companyId_idx" ON "public"."NotasExplicativas"("companyId");

-- CreateIndex
CREATE INDEX "NotasExplicativas_number_idx" ON "public"."NotasExplicativas"("number");

-- CreateIndex
CREATE UNIQUE INDEX "NotasExplicativas_companyId_number_key" ON "public"."NotasExplicativas"("companyId", "number");

-- AddForeignKey
ALTER TABLE "public"."NotasExplicativas" ADD CONSTRAINT "NotasExplicativas_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
