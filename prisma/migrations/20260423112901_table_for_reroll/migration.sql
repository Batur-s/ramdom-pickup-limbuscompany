/*
  Warnings:

  - You are about to drop the column `appliedToDeckSlotId` on the `GameRerollResults` table. All the data in the column will be lost.
  - You are about to drop the column `rolledTier` on the `GameRerollResults` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `GameRerolls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rerollId,identityId]` on the table `GameRerollResults` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userIdentityId` to the `GameRerollResults` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameRerolls_gameId_floor_idx";

-- AlterTable
ALTER TABLE "GameRerollResults" DROP COLUMN "appliedToDeckSlotId",
DROP COLUMN "rolledTier",
ADD COLUMN     "appliedAt" TIMESTAMP(3),
ADD COLUMN     "appliedToDeckId" TEXT,
ADD COLUMN     "userIdentityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GameRerolls" DROP COLUMN "floor",
ADD COLUMN     "floorNumber" INTEGER;

-- CreateIndex
CREATE INDEX "GameRerollResults_userIdentityId_idx" ON "GameRerollResults"("userIdentityId");

-- CreateIndex
CREATE INDEX "GameRerollResults_appliedToDeckId_idx" ON "GameRerollResults"("appliedToDeckId");

-- CreateIndex
CREATE UNIQUE INDEX "GameRerollResults_rerollId_identityId_key" ON "GameRerollResults"("rerollId", "identityId");

-- CreateIndex
CREATE INDEX "GameRerolls_gameId_floorNumber_idx" ON "GameRerolls"("gameId", "floorNumber");

-- CreateIndex
CREATE INDEX "GameRerolls_gameId_rerollIndex_idx" ON "GameRerolls"("gameId", "rerollIndex");

-- AddForeignKey
ALTER TABLE "GameRerollResults" ADD CONSTRAINT "GameRerollResults_userIdentityId_fkey" FOREIGN KEY ("userIdentityId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRerollResults" ADD CONSTRAINT "GameRerollResults_appliedToDeckId_fkey" FOREIGN KEY ("appliedToDeckId") REFERENCES "GameDecks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
