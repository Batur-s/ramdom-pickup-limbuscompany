/*
  Warnings:

  - Changed the type of `tier` on the `GameRerollResults` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GameRerollResults" DROP COLUMN "tier",
ADD COLUMN     "tier" "Tier" NOT NULL;
