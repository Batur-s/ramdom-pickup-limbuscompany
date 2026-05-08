/*
  Warnings:

  - You are about to drop the column `diffculty` on the `GameStages` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `GameStages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameStages" DROP COLUMN "diffculty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL;
