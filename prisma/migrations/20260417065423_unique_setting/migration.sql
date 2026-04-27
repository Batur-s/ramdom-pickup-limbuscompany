/*
  Warnings:

  - A unique constraint covering the columns `[userId,identityId]` on the table `UserIdentity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserIdentity_userId_identityId_key" ON "UserIdentity"("userId", "identityId");
