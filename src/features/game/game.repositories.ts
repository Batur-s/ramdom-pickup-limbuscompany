// features/game/game.repositories.ts
import prisma from '../../lib/prisma';
import { PrismaClient } from '@prisma/client';

type Tx = PrismaClient; // 또는 tx 타입을 프로젝트 스타일에 맞게

export const gamesRepository = {
  async createGame(tx: any, { userId, title }: { userId: string; title?: string }) {
    return tx.games.create({
      data: {
        userId,
        title: title ?? 'New Run',
        currentFloor: 1,
        status: 'PAUSE',
      },
      select: { id: true, currentFloor: true },
    });
  },

  async assertUserIdentitiesBelongToUser(
    tx: any,
    { userId, userIdentityIds }: { userId: string; userIdentityIds: string[] },
  ) {
    const count = await tx.userIdentity.count({
      where: {
        userId,
        id: { in: userIdentityIds },
      },
    });

    if (count !== userIdentityIds.length) {
      throw new Error('deck contains identities not owned by user');
    }
  },

  async createDeckSlots(
    tx: any,
    {
      gameId,
      deck,
    }: {
      gameId: string;
      deck: { sinnerId: string; userIdentityId: string }[];
    },
  ) {
    await tx.gameDecks.createMany({
      data: deck.map((d) => ({
        gameId,
        sinnerId: d.sinnerId,
        userIdentityId: d.userIdentityId,
      })),
    });
  },
};
