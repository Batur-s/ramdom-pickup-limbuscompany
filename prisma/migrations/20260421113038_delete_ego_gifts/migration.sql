/*
  Warnings:

  - You are about to drop the `GameEgoGifts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameFloorRewards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StageInventories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameEgoGifts" DROP CONSTRAINT "GameEgoGifts_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameFloorRewards" DROP CONSTRAINT "GameFloorRewards_gameFloorRunId_fkey";

-- DropForeignKey
ALTER TABLE "GameFloorRewards" DROP CONSTRAINT "GameFloorRewards_gamesId_fkey";

-- DropForeignKey
ALTER TABLE "StageInventories" DROP CONSTRAINT "StageInventories_stageId_fkey";

-- DropTable
DROP TABLE "GameEgoGifts";

-- DropTable
DROP TABLE "GameFloorRewards";

-- DropTable
DROP TABLE "StageInventories";
