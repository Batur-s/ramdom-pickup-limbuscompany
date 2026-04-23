// features/game/game.repositories.ts
import prisma from '../../lib/prisma';
import { PrismaClient } from '@prisma/client';

type Tx = PrismaClient;

function weightedPick3Unique(
  candidates: Array<{ userIdentityId: string; identityId: string; tier: string; grade: number }>,
  tierWeight: Record<string, number>,
) {
  const remaining = [...candidates];
  const picked: typeof remaining = [];

  for (let pick = 0; pick < 3; pick++) {
    const weights = remaining.map((c) => tierWeight[c.tier] ?? 1);
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) throw new Error('Invalid weight table');

    let r = Math.random() * total;
    let idx = 0;
    for (; idx < remaining.length; idx++) {
      r -= weights[idx];
      if (r <= 0) break;
    }

    const [sel] = remaining.splice(idx, 1);
    picked.push(sel);
  }

  // ranked output(예: rankInRoll = 1..3 내림차순 의미 부여하려면 여기서 정렬 로직 추가)
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
    // 1) game 소유 확인 + currentFloor
    const game = await prisma.games.findFirst({
      where: { id: gameId, userId },
      select: { id: true, currentFloor: true },
    });
    if (!game) throw new Error('Game not found');

    // 2) 현재 덱(userIdentityId 목록)
    const deckUserIdentityIds = await prisma.gameDecks.findMany({
      where: { gameId },
      select: { userIdentityId: true },
    });
    const deckSet = new Set(deckUserIdentityIds.map((x) => x.userIdentityId));

    // 3) 덱 밖 후보(유저가 가진 UserIdentity 중 identity를 조인해서 tier/grade 확인)
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
      take: 2000, // MVP: 과도한 풀 방지용(필요하면 제거)
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

    // 4) 후보 3개 확정
    const picked = weightedPick3Unique(mappedCandidates, tierWeight);

    // 5) rerollIndex 계산(층당 1회라면 간단히 1 증가; 여기선 floor 단위로 개수 세기)
    const rerollIndex = await prisma.gameRerolls.count({
      where: { gameId, floorNumber: game.currentFloor ?? (undefined as any) },
    });

    const newReroll = await prisma.$transaction(async (tx) => {
      const reroll = await tx.gameRerolls.create({
        data: {
          gameId,
          floorNumber: game.currentFloor,
          rerollIndex: rerollIndex + 1,
          // MVP: seed/probabilityModelVersion은 나중에 확장
          probabilityModelVersion: 1,
          seed: null,
        },
        select: { id: true },
      });

      // 6) results 3행 저장
      await tx.gameRerollResults.createMany({
        data: picked.map((p) => ({
          rerollId: reroll.id,
          identityId: p.identityId,
          userIdentityId: p.userIdentityId,
          rolledTier: p.tier as any, // Prisma Tier enum에 맞춰 캐스팅
          rankInRoll: p.rankInRoll,
        })),
      });

      return reroll.id;
    });

    // 7) 응답용 candidate detail 재조회(간단히 picked 기반으로 구성해도 됨)
    // 여기서는 picked를 그대로 응답
    return {
      rerollId: newReroll,
      floorNumber: game.currentFloor,
      candidates: picked.map((p) => ({
        identityId: p.identityId,
        userIdentityId: p.userIdentityId,
        rolledTier: p.tier,
        rankInRoll: p.rankInRoll,
      })),
    };
  },
};
