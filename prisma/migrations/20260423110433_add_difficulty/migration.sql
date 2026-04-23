/*
  Warnings:

  - Added the required column `diffculty` to the `GameStages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('NORMAL', 'HARD');

-- AlterTable
ALTER TABLE "GameStages" ADD COLUMN     "diffculty" "Difficulty" NOT NULL;
