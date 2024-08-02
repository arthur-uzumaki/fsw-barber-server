/*
  Warnings:

  - You are about to drop the `Booke` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booke" DROP CONSTRAINT "Booke_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Booke" DROP CONSTRAINT "Booke_userId_fkey";

-- DropTable
DROP TABLE "Booke";

-- CreateTable
CREATE TABLE "booke" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booke_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booke" ADD CONSTRAINT "booke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booke" ADD CONSTRAINT "booke_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "barder_shop_service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
