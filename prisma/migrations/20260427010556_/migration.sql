/*
  Warnings:

  - You are about to drop the column `rolledtier` on the `GameRerollResults` table. All the data in the column will be lost.
  - Added the required column `rolledTier` to the `GameRerollResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameRerollResults" DROP COLUMN "rolledtier",
ADD COLUMN     "rolledTier" "Tier" NOT NULL;
