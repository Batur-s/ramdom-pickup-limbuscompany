/*
  Warnings:

  - You are about to drop the column `floor_inventoriesId` on the `EgoGifts` table. All the data in the column will be lost.
  - You are about to drop the column `gameFloorsId` on the `Floors` table. All the data in the column will be lost.
  - You are about to drop the `FloorInventories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameFloors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Identities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserIdentities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stage_inventoriesId` to the `EgoGifts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `keyword` on the `EgoGifts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `EgoGifts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "EgoGifts" DROP CONSTRAINT "EgoGifts_floor_inventoriesId_fkey";

-- DropForeignKey
ALTER TABLE "FloorInventories" DROP CONSTRAINT "FloorInventories_floorId_fkey";

-- DropForeignKey
ALTER TABLE "Floors" DROP CONSTRAINT "Floors_gameFloorsId_fkey";

-- DropForeignKey
ALTER TABLE "GameDecks" DROP CONSTRAINT "GameDecks_userIdentityId_fkey";

-- DropForeignKey
ALTER TABLE "GameFloors" DROP CONSTRAINT "GameFloors_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Identities" DROP CONSTRAINT "Identities_sinnerId_fkey";

-- DropForeignKey
ALTER TABLE "UserIdentities" DROP CONSTRAINT "UserIdentities_identityId_fkey";

-- DropForeignKey
ALTER TABLE "UserIdentities" DROP CONSTRAINT "UserIdentities_userId_fkey";

-- AlterTable
ALTER TABLE "EgoGifts" DROP COLUMN "floor_inventoriesId",
ADD COLUMN     "stage_inventoriesId" TEXT NOT NULL,
DROP COLUMN "keyword",
ADD COLUMN     "keyword" "Keyword" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL;

-- AlterTable
ALTER TABLE "Floors" DROP COLUMN "gameFloorsId";

-- DropTable
DROP TABLE "FloorInventories";

-- DropTable
DROP TABLE "GameFloors";

-- DropTable
DROP TABLE "Identities";

-- DropTable
DROP TABLE "UserIdentities";

-- CreateTable
CREATE TABLE "UserIdentity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "syncGrade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sinnerId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "tier" "Tier" NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stages" (
    "id" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageInventories" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,

    CONSTRAINT "StageInventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameFloorRuns" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "stageId" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'PAUSE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clearedAt" TIMESTAMP(3),

    CONSTRAINT "GameFloorRuns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEgoGifts" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "egoGiftId" TEXT NOT NULL,
    "status" "GiftStatus" NOT NULL DEFAULT 'BOUGHT',
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "GameEgoGifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameFloorRewards" (
    "id" TEXT NOT NULL,
    "gameFloorRunId" TEXT NOT NULL,
    "egoGiftId" TEXT NOT NULL,
    "action" "GiftStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameEgoGiftId" TEXT,
    "gamesId" TEXT,

    CONSTRAINT "GameFloorRewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRerolls" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "floorNumber" INTEGER,
    "rerollIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "probabilityModelVersion" INTEGER,
    "seed" TEXT,

    CONSTRAINT "GameRerolls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRerollResults" (
    "id" TEXT NOT NULL,
    "rerollId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "rolledTier" "Tier" NOT NULL,
    "rankInRoll" INTEGER,
    "appliedToDeckSlotId" TEXT,

    CONSTRAINT "GameRerollResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StageInventories_stageId_key" ON "StageInventories"("stageId");

-- CreateIndex
CREATE UNIQUE INDEX "GameFloorRuns_gameId_floorNumber_key" ON "GameFloorRuns"("gameId", "floorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GameEgoGifts_gameId_egoGiftId_key" ON "GameEgoGifts"("gameId", "egoGiftId");

-- CreateIndex
CREATE UNIQUE INDEX "GameFloorRewards_gameFloorRunId_egoGiftId_key" ON "GameFloorRewards"("gameFloorRunId", "egoGiftId");

-- CreateIndex
CREATE INDEX "GameRerolls_gameId_floorNumber_idx" ON "GameRerolls"("gameId", "floorNumber");

-- CreateIndex
CREATE INDEX "GameRerollResults_identityId_idx" ON "GameRerollResults"("identityId");

-- CreateIndex
CREATE INDEX "GameDecks_gameId_idx" ON "GameDecks"("gameId");

-- AddForeignKey
ALTER TABLE "UserIdentity" ADD CONSTRAINT "UserIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIdentity" ADD CONSTRAINT "UserIdentity_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_sinnerId_fkey" FOREIGN KEY ("sinnerId") REFERENCES "Sinners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameDecks" ADD CONSTRAINT "GameDecks_userIdentityId_fkey" FOREIGN KEY ("userIdentityId") REFERENCES "UserIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stages" ADD CONSTRAINT "Stages_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageInventories" ADD CONSTRAINT "StageInventories_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EgoGifts" ADD CONSTRAINT "EgoGifts_stage_inventoriesId_fkey" FOREIGN KEY ("stage_inventoriesId") REFERENCES "StageInventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloorRuns" ADD CONSTRAINT "GameFloorRuns_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloorRuns" ADD CONSTRAINT "GameFloorRuns_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEgoGifts" ADD CONSTRAINT "GameEgoGifts_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEgoGifts" ADD CONSTRAINT "GameEgoGifts_egoGiftId_fkey" FOREIGN KEY ("egoGiftId") REFERENCES "EgoGifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloorRewards" ADD CONSTRAINT "GameFloorRewards_gameFloorRunId_fkey" FOREIGN KEY ("gameFloorRunId") REFERENCES "GameFloorRuns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloorRewards" ADD CONSTRAINT "GameFloorRewards_egoGiftId_fkey" FOREIGN KEY ("egoGiftId") REFERENCES "EgoGifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloorRewards" ADD CONSTRAINT "GameFloorRewards_gameEgoGiftId_fkey" FOREIGN KEY ("gameEgoGiftId") REFERENCES "GameEgoGifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloorRewards" ADD CONSTRAINT "GameFloorRewards_gamesId_fkey" FOREIGN KEY ("gamesId") REFERENCES "Games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRerolls" ADD CONSTRAINT "GameRerolls_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRerollResults" ADD CONSTRAINT "GameRerollResults_rerollId_fkey" FOREIGN KEY ("rerollId") REFERENCES "GameRerolls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRerollResults" ADD CONSTRAINT "GameRerollResults_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
