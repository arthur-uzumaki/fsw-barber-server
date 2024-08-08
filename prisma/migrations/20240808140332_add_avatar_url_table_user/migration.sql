/*
  Warnings:

  - Added the required column `avatarUrl` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatarUrl" TEXT NOT NULL;
