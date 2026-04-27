/*
  Warnings:

  - Changed the type of `deckSlotIndex` on the `GameDecks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GameDecks" DROP COLUMN "deckSlotIndex",
ADD COLUMN     "deckSlotIndex" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameDecks_gameId_deckSlotIndex_key" ON "GameDecks"("gameId", "deckSlotIndex");
