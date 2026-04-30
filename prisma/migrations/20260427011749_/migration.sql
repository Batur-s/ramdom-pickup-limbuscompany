-- DropForeignKey
ALTER TABLE "GameRerollResults" DROP CONSTRAINT "GameRerollResults_userIdentityId_fkey";

-- AlterTable
ALTER TABLE "GameRerollResults" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "GameRerollResults" ADD CONSTRAINT "GameRerollResults_userIdentityId_fkey" FOREIGN KEY ("userIdentityId") REFERENCES "UserIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRerollResults" ADD CONSTRAINT "GameRerollResults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
