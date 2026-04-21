/*
  Warnings:

  - You are about to drop the column `floorId` on the `Stages` table. All the data in the column will be lost.
  - You are about to drop the `Floors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameFloorRuns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameFloorRuns" DROP CONSTRAINT "GameFloorRuns_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameFloorRuns" DROP CONSTRAINT "GameFloorRuns_stageId_fkey";

-- DropForeignKey
ALTER TABLE "Stages" DROP CONSTRAINT "Stages_floorId_fkey";

-- AlterTable
ALTER TABLE "Stages" DROP COLUMN "floorId",
ADD COLUMN     "hardFloorC" INTEGER,
ADD COLUMN     "hardFloorD" INTEGER,
ADD COLUMN     "normalFloorA" INTEGER,
ADD COLUMN     "normalFloorB" INTEGER;

-- DropTable
DROP TABLE "Floors";

-- DropTable
DROP TABLE "GameFloorRuns";

-- CreateTable
CREATE TABLE "GameStages" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,

    CONSTRAINT "GameStages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameStages_gameId_idx" ON "GameStages"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStages_gameId_stageId_key" ON "GameStages"("gameId", "stageId");

-- AddForeignKey
ALTER TABLE "GameStages" ADD CONSTRAINT "GameStages_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStages" ADD CONSTRAINT "GameStages_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
