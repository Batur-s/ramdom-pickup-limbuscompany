-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('CLEAR', 'FAILURE', 'PAUSE');

-- CreateEnum
CREATE TYPE "GiftStatus" AS ENUM ('BOUGHT', 'SOLD', 'FUSED');

-- CreateEnum
CREATE TYPE "Keyword" AS ENUM ('BURN', 'BLEED', 'TREMOR', 'RUPTURE', 'SINKING', 'POISE', 'CHARGE', 'SLASH', 'PIERCE', 'BLUNT');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('NORMAL', 'FUSION', 'UNIQUE', 'HIDDEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIdentities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "syncGrade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserIdentities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sinnerId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sinners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sinners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameDecks" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userIdentityId" TEXT NOT NULL,

    CONSTRAINT "GameDecks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'PAUSE',
    "currentFloor" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameFloors" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GameFloors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameFloorsId" TEXT NOT NULL,

    CONSTRAINT "Floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorInventories" (
    "id" TEXT NOT NULL,
    "giftStatus" BOOLEAN NOT NULL,
    "floorId" TEXT NOT NULL,

    CONSTRAINT "FloorInventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EgoGifts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "keyword" BOOLEAN NOT NULL,
    "type" BOOLEAN NOT NULL,
    "floor_inventoriesId" TEXT NOT NULL,

    CONSTRAINT "EgoGifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sinners_name_key" ON "Sinners"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameFloors_gameId_key" ON "GameFloors"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "FloorInventories_floorId_key" ON "FloorInventories"("floorId");

-- AddForeignKey
ALTER TABLE "UserIdentities" ADD CONSTRAINT "UserIdentities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIdentities" ADD CONSTRAINT "UserIdentities_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identities" ADD CONSTRAINT "Identities_sinnerId_fkey" FOREIGN KEY ("sinnerId") REFERENCES "Sinners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameDecks" ADD CONSTRAINT "GameDecks_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameDecks" ADD CONSTRAINT "GameDecks_userIdentityId_fkey" FOREIGN KEY ("userIdentityId") REFERENCES "UserIdentities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFloors" ADD CONSTRAINT "GameFloors_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floors" ADD CONSTRAINT "Floors_gameFloorsId_fkey" FOREIGN KEY ("gameFloorsId") REFERENCES "GameFloors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorInventories" ADD CONSTRAINT "FloorInventories_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EgoGifts" ADD CONSTRAINT "EgoGifts_floor_inventoriesId_fkey" FOREIGN KEY ("floor_inventoriesId") REFERENCES "FloorInventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
