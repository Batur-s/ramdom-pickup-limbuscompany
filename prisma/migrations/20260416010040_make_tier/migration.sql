/*
  Warnings:

  - Added the required column `tier` to the `Identities` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('S', 'A', 'B', 'C', 'D', 'E');

-- AlterTable
ALTER TABLE "Identities" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "tier" "Tier" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isNewUser" BOOLEAN NOT NULL DEFAULT true;
