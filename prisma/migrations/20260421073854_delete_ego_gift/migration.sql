/*
  Warnings:

  - You are about to drop the column `status` on the `GameEgoGifts` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `GameFloorRewards` table. All the data in the column will be lost.
  - You are about to drop the column `gameEgoGiftId` on the `GameFloorRewards` table. All the data in the column will be lost.
  - You are about to drop the `EgoGifts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EgoGifts" DROP CONSTRAINT "EgoGifts_stage_inventoriesId_fkey";

-- DropForeignKey
ALTER TABLE "GameEgoGifts" DROP CONSTRAINT "GameEgoGifts_egoGiftId_fkey";

-- DropForeignKey
ALTER TABLE "GameFloorRewards" DROP CONSTRAINT "GameFloorRewards_egoGiftId_fkey";

-- DropForeignKey
ALTER TABLE "GameFloorRewards" DROP CONSTRAINT "GameFloorRewards_gameEgoGiftId_fkey";

-- AlterTable
ALTER TABLE "GameEgoGifts" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "GameFloorRewards" DROP COLUMN "action",
DROP COLUMN "gameEgoGiftId";

-- DropTable
DROP TABLE "EgoGifts";

-- DropEnum
DROP TYPE "GiftStatus";

-- DropEnum
DROP TYPE "Keyword";

-- DropEnum
DROP TYPE "Type";
