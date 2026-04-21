// features/game/game.service.ts
import prisma from '../../lib/prisma';
import { gamesRepository } from './game.repositories';

type DeckSlotInput = { sinnerId: string; userIdentityId: string };

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

  async rerollIdentities({ userId, deck }: { userId: string; deck: DeckSlotInput[] }) {
    if (!deck || !Array.isArray(deck)) throw new Error('deck is required');
  },
};
