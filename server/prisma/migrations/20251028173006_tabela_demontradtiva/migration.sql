-- CreateTable
CREATE TABLE "public"."TabelaDemonstrativa" (
    "id" TEXT NOT NULL,
    "notaId" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "anoAnterior" DOUBLE PRECISION,
    "anoAtual" DOUBLE PRECISION,
    "ordem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TabelaDemonstrativa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TabelaDemonstrativa_notaId_idx" ON "public"."TabelaDemonstrativa"("notaId");

-- CreateIndex
CREATE INDEX "TabelaDemonstrativa_ordem_idx" ON "public"."TabelaDemonstrativa"("ordem");

-- AddForeignKey
ALTER TABLE "public"."TabelaDemonstrativa" ADD CONSTRAINT "TabelaDemonstrativa_notaId_fkey" FOREIGN KEY ("notaId") REFERENCES "public"."NotasExplicativas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
