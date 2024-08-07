/*
  Warnings:

  - You are about to drop the column `bardershopId` on the `barder_shop_service` table. All the data in the column will be lost.
  - Added the required column `barbershopId` to the `barder_shop_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "barder_shop_service" DROP CONSTRAINT "barder_shop_service_bardershopId_fkey";

-- AlterTable
ALTER TABLE "barder_shop_service" DROP COLUMN "bardershopId",
ADD COLUMN     "barbershopId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "barder_shop_service" ADD CONSTRAINT "barder_shop_service_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "barder_shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
