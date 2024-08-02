/*
  Warnings:

  - You are about to drop the column `deacription` on the `barder_shop` table. All the data in the column will be lost.
  - Added the required column `description` to the `barder_shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "barder_shop" DROP COLUMN "deacription",
ADD COLUMN     "description" TEXT NOT NULL;
