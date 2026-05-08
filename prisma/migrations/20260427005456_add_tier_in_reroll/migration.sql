/*
  Warnings:

  - Added the required column `tier` to the `GameRerollResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameRerollResults" ADD COLUMN     "tier" TEXT NOT NULL;
