/*
  Warnings:

  - You are about to drop the column `tier` on the `GameRerollResults` table. All the data in the column will be lost.
  - Added the required column `rolledtier` to the `GameRerollResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameRerollResults" DROP COLUMN "tier",
ADD COLUMN     "rolledtier" "Tier" NOT NULL;
