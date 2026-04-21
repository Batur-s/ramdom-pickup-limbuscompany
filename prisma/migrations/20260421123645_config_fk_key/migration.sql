/*
  Warnings:

  - You are about to drop the column `floorNumber` on the `GameRerolls` table. All the data in the column will be lost.
  - Added the required column `floor` to the `GameStages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameRerolls_gameId_floorNumber_idx";

-- AlterTable
ALTER TABLE "GameRerolls" DROP COLUMN "floorNumber",
ADD COLUMN     "floor" INTEGER;

-- AlterTable
ALTER TABLE "GameStages" ADD COLUMN     "floor" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GameRerolls_gameId_floor_idx" ON "GameRerolls"("gameId", "floor");
