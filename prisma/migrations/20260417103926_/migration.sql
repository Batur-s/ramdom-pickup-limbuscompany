/*
  Warnings:

  - A unique constraint covering the columns `[gameId,deckSlotIndex]` on the table `GameDecks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deckSlotIndex` to the `GameDecks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameDecks" ADD COLUMN     "deckSlotIndex" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameDecks_gameId_deckSlotIndex_key" ON "GameDecks"("gameId", "deckSlotIndex");
