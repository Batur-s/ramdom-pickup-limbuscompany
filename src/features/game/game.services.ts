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

    // deckSlotIndex 중복 방지(간단 검증)
    const slotSet = new Set<string>();
    for (const d of deck) {
      if (typeof d.sinnerId !== 'string') throw new Error('sinnerId must be string');
      if (slotSet.has(d.sinnerId)) throw new Error('duplicate sinnerId');
      slotSet.add(d.sinnerId);
    }

    return prisma.$transaction(async (tx) => {
      // 1) 게임 생성
      const game = await gamesRepository.createGame(tx, { userId, title });

      // 2) (중요) deck에 들어있는 userIdentityId들이 "요청 user의 소유인지" 검증
      //    - 이 검증이 있어야 다른 userIdentityId를 섞어 보내도 저장되지 않음.
      await gamesRepository.assertUserIdentitiesBelongToUser(tx, {
        userId,
        userIdentityIds: deck.map((d) => d.userIdentityId),
      });

      // 3) 덱 슬롯 저장(GameDeckSlots)
      await gamesRepository.createDeckSlots(tx, {
        gameId: game.id,
        deck,
      });

      return { gameId: game.id, currentFloor: game.currentFloor };
    });
  },
};
