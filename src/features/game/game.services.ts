// features/game/game.service.ts
import prisma from '../../lib/prisma';
import { gamesRepository } from './game.repositories';
import { GameStatus } from '@prisma/client';

type DeckSlotInput = { sinnerId: string; userIdentityId: string };

type CreateRerollInput = { userId: string; gameId: string };

type UpdateRerollInput = {
  userId: string;
  gameId: string;
  rerollId: string;
  selectUserIdentityId: string;
};

const tierWeight: Record<string, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 1,
};

export const gamesService = {
  async createGame({
    userId,
    title,
    deck,
  }: {
    userId: string;
    title?: string;
    deck: DeckSlotInput[];
  }) {
    if (!deck || !Array.isArray(deck)) throw new Error('deck is required');
    if (deck.length !== 12) throw new Error('deck size must be 12');

    const slotSet = new Set<string>();
    for (const d of deck) {
      if (typeof d.sinnerId !== 'string') throw new Error('sinnerId must be string');
      if (slotSet.has(d.sinnerId)) throw new Error('duplicate sinnerId');
      slotSet.add(d.sinnerId);
    }

    return prisma.$transaction(async (tx) => {
      const game = await gamesRepository.createGame(tx, { userId, title });

      await gamesRepository.assertUserIdentitiesBelongToUser(tx, {
        userId,
        userIdentityIds: deck.map((d) => d.userIdentityId),
      });

      await gamesRepository.createDeckSlots(tx, {
        gameId: game.id,
        deck,
      });

      return { gameId: game.id, currentFloor: game.currentFloor };
    });
  },

  async getGameDeckByGameId({ userId, gameId }: { userId: string; gameId: string }) {
    const game = await gamesRepository.findGameOwnedByUser({ userId, gameId });
    if (!game) throw new Error('Game not found');

    const deck = await gamesRepository.getDeckIttemsForGame({ gameId });

    deck.sort((a, b) => a.sinnerId.localeCompare(b.sinnerId));

    return deck;
  },

  async createRerollForGame({ userId, gameId }: CreateRerollInput) {
    return gamesRepository.createRerollWithCandidates({ userId, gameId, tierWeight });
  },

  async updateRerollForGame({ userId, gameId, rerollId, selectUserIdentityId }: UpdateRerollInput) {
    return gamesRepository.UpdateRerollInput({ userId, gameId, rerollId, selectUserIdentityId });
  },

  async getAvailableStages({
    userId,
    gameId,
    difficulty,
  }: {
    userId: string;
    gameId: string;
    difficulty: 'NORMAL' | 'HARD';
  }) {
    return gamesRepository.getAvailableStagesForGame({ userId, gameId, difficulty });
  },

  async updateStages({
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
    return gamesRepository.updateStagesForGame({ userId, gameId, stageId, difficulty });
  },

  async advanceStage({ userId, gameId }: { userId: string; gameId: string }) {
    return gamesRepository.updateFloorForGame({ userId, gameId });
  },

  async changeStatus({
    userId,
    gameId,
    status,
  }: {
    userId: string;
    gameId: string;
    status: GameStatus;
  }) {
    return gamesRepository.updateStatusForGame({ userId, gameId, status });
  },

  async gameSummary({ userId, gameId }: { userId: string; gameId: string }) {
    return gamesRepository.summaryGameForCommunity({ userId, gameId });
  },
};
