/*
  Warnings:

  - You are about to drop the column `deckSlotIndex` on the `GameDecks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,sinnerId]` on the table `GameDecks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sinnerId` to the `GameDecks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameDecks_gameId_deckSlotIndex_key";

-- AlterTable
ALTER TABLE "GameDecks" DROP COLUMN "deckSlotIndex",
ADD COLUMN     "sinnerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameDecks_gameId_sinnerId_key" ON "GameDecks"("gameId", "sinnerId");
