// features/game/game.repositories.ts
import { truncate } from 'fs';
import prisma from '../../lib/prisma';
import { PrismaClient, GameStatus } from '@prisma/client';

type Tx = PrismaClient;

function weightedPick3Unique(
  candidates: Array<{ userIdentityId: string; identityId: string; tier: string; grade: number }>,
  tierWeight: Record<string, number>,
) {
  const remaining = [...candidates];
  const picked: typeof remaining = [];

  for (let pick = 0; pick < 3; pick++) {
    const weights: number[] = remaining.map((c) => tierWeight[c.tier] ?? 1);
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) throw new Error('Invalid weight table');

    let r = Math.random() * total;
    let idx = 0;
    for (; idx < remaining.length; idx++) {
      r -= weights[idx] ?? 0;
      if (r <= 0) break;
    }

    const [sel] = remaining.splice(idx, 1);
    if (!sel) throw new Error('Candidate not found while picking');
    picked.push(sel);
  }

  return picked.map((x, i) => ({ ...x, rankInRoll: i + 1 }));
}

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

  async findGameOwnedByUser({ userId, gameId }: { userId: string; gameId: string }) {
    return prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true },
    });
  },

  async getDeckIttemsForGame({ gameId }: { gameId: string }) {
    const rows = await prisma.gameDecks.findMany({
      where: { gameId },
      include: {
        userIdentity: {
          include: {
            identity: {
              select: {
                id: true,
                name: true,
                sinnerId: true,
                tier: true,
                grade: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
    return rows.map((r) => ({
      gameDeckId: r.id,
      sinnerId: r.sinnerId,
      userIdentityId: r.userIdentityId,
      syncGrade: r.userIdentity.syncGrade,
      identity: r.userIdentity.identity,
    }));
  },

  async createRerollWithCandidates({
    userId,
    gameId,
    tierWeight,
  }: {
    userId: string;
    gameId: string;
    tierWeight: Record<string, number>;
  }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true, currentFloor: true },
    });
    if (!game) throw new Error('Game not found');

    const deckUserIdentityIds = await prisma.gameDecks.findMany({
      where: { gameId },
      select: { userIdentityId: true },
    });
    const deckSet = new Set(deckUserIdentityIds.map((x) => x.userIdentityId));

    const candidates = await prisma.userIdentity.findMany({
      where: {
        userId,
        id: { notIn: Array.from(deckSet) },
      },
      include: {
        identity: {
          select: {
            id: true,
            tier: true,
            grade: true,
          },
        },
      },
      take: 2000,
    });

    const mappedCandidates = candidates.map((c) => ({
      userIdentityId: c.id,
      identityId: c.identityId,
      tier: c.identity.tier,
      grade: c.identity.grade,
    }));

    if (mappedCandidates.length < 3) {
      throw new Error('Not enough candidates outside deck');
    }

    const picked = weightedPick3Unique(mappedCandidates, tierWeight);

    const rerollIndex = await prisma.gameRerolls.count({
      where: { gameId, floorNumber: game.currentFloor },
    });

    const newReroll = await prisma.$transaction(async (tx) => {
      const reroll = await tx.gameRerolls.create({
        data: {
          gameId,
          floorNumber: game.currentFloor,
          rerollIndex: rerollIndex + 1,
          probabilityModelVersion: 1,
          seed: null,
        },
        select: { id: true },
      });

      await tx.gameRerollResults.createMany({
        data: picked.map((p) => ({
          rerollId: reroll.id,
          identityId: p.identityId,
          userIdentityId: p.userIdentityId,
          rankInRoll: p.rankInRoll,
          rolledTier: p.tier as any,
        })),
      });

      return reroll.id;
    });

    return {
      rerollId: newReroll,
      floorNumber: game.currentFloor,
      candidates: picked.map((p) => ({
        identityId: p.identityId,
        userIdentityId: p.userIdentityId,
        rankInRoll: p.rankInRoll,
        rolledTier: p.tier,
      })),
    };
  },

  async UpdateRerollInput({
    userId,
    gameId,
    rerollId,
    selectUserIdentityId,
  }: {
    userId: string;
    gameId: string;
    rerollId: string;
    selectUserIdentityId: string;
  }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true, currentFloor: true },
    });
    if (!game) throw new Error('Game not found');

    const selectResult = await prisma.gameRerollResults.findFirst({
      where: { rerollId, userIdentityId: selectUserIdentityId },
      select: {
        identityId: true,
        userIdentityId: true,
        identity: {
          select: {
            sinnerId: true,
          },
        },
      },
    });

    if (!selectResult) throw new Error('Select result not found');
    const targetSinnerId = selectResult.identity.sinnerId;

    const deckRow = await prisma.gameDecks.findFirst({
      where: { gameId, sinnerId: targetSinnerId },
      select: { id: true },
    });

    if (!deckRow) throw new Error('Deck slot not found for (gameId, sinnerId)');

    const updated = await prisma.gameDecks.update({
      where: { id: deckRow.id },
      data: { userIdentityId: selectUserIdentityId },
      select: {
        id: true,
        gameId: true,
        sinnerId: true,
        userIdentityId: true,
      },
    });

    await prisma.gameRerollResults.updateMany({
      where: {
        rerollId,
        userIdentityId: selectUserIdentityId,
      },
      data: {
        appliedAt: new Date(),
        appliedToDeckId: updated.id,
      },
    });

    return {
      gameId,
      rerollId,
      applied: {
        sinnerId: targetSinnerId,
        newUserIdentityId: selectUserIdentityId,
        updatedDeckId: updated.id,
      },
    };
  },

  async getAvailableStagesForGame({
    userId,
    gameId,
    difficulty,
  }: {
    userId: string;
    gameId: string;
    difficulty: 'NORMAL' | 'HARD';
  }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { currentFloor: true },
    });
    if (!game) throw new Error('Game not found');

    const floor = game.currentFloor;
    const allStages = await prisma.stages.findMany();

    const available = allStages.filter((stage) => {
      const floorA = difficulty === 'NORMAL' ? stage.normalFloorA : stage.hardFloorA;
      const floorB = difficulty === 'NORMAL' ? stage.normalFloorB : stage.hardFloorB;

      if (floorA === null || floorA === 0) return false;
      if (floorB === null || floorB === 0) return false;
      if (floorB === 0) return floor === floorA;
      return floor >= floorA && floor <= floorB;
    });

    return {
      floor,
      difficulty,
      stages: available.map(({ id, name }) => ({ id, name })),
    };
  },

  async updateStagesForGame({
    userId,
    gameId,
    stageId,
    difficulty,
  }: {
    userId: string;
    gameId: string;
    stageId: string;
    difficulty: 'NORMAL' | 'HARD';
  }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true, currentFloor: true },
    });
    if (!game) throw new Error('Game not found');

    const selectStage = await prisma.stages.findFirst({
      where: { id: stageId },
      select: { id: true, name: true },
    });
    if (!selectStage) throw new Error('Stage not found');

    const updated = await prisma.gameStages.create({
      data: {
        gameId,
        stageId: selectStage.id,
        floor: game.currentFloor,
        difficulty: difficulty,
      },
      select: {
        id: true,
        gameId: true,
        stageId: true,
        floor: true,
        difficulty: true,
      },
    });
  },

  async updateFloorForGame({ userId, gameId }: { userId: string; gameId: string }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true, currentFloor: true },
    });
    if (!game) throw new Error('Game not found');

    return prisma.games.update({
      where: { id: game.id },
      data: { currentFloor: game.currentFloor + 1 },
      select: { id: true, currentFloor: true },
    });
  },

  async updateStatusForGame({
    userId,
    gameId,
    status,
  }: {
    userId: string;
    gameId: string;
    status: GameStatus;
  }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true, status: true },
    });
    if (!game) throw new Error('Game not found');

    return prisma.games.update({
      where: { id: game.id },
      data: { status },
      select: { id: true, status: true },
    });
  },

  async summaryGameForCommunity({ userId, gameId }: { gameId: string; userId: string }) {
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: {
        id: true,
        title: true,
        status: true,
        currentFloor: true,
        createdAt: true,
        gameStages: {
          select: {
            floor: true,
            difficulty: true,
            stages: {
              select: { id: true, name: true },
            },
          },
          orderBy: { floor: 'asc' },
        },

        gameDecks: {
          select: {
            sinnerId: true,
            userIdentity: {
              select: {
                syncGrade: true,
                identity: {
                  select: { id: true, name: true, tier: true, grade: true, imageUrl: true },
                },
              },
            },
          },
        },
      },
    });
    if (!game) throw new Error('Game not found');

    return game;
  },
};
