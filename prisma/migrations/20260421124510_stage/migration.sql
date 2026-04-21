/*
  Warnings:

  - You are about to drop the column `hardFloorC` on the `Stages` table. All the data in the column will be lost.
  - You are about to drop the column `hardFloorD` on the `Stages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stages" DROP COLUMN "hardFloorC",
DROP COLUMN "hardFloorD",
ADD COLUMN     "hardFloorA" INTEGER,
ADD COLUMN     "hardFloorB" INTEGER;
