// services/meIdentitiesService.ts
import { decksRepository } from './deck.repositories';
import { meIdentitiesRepository } from '../identity/identity.repositories';

export const deckService = {
  async getMyIdentitiesBySinner(userId: string) {
    const rows = await meIdentitiesRepository.findIdentitiesByUserId(userId);

    const bySinner: Record<string, typeof rows> = {};

    for (const r of rows) {
      if (!bySinner[r.sinnerId]) bySinner[r.sinnerId] = [];
      bySinner[r.sinnerId]?.push(r);
    }

    for (const sinnerId of Object.keys(bySinner)) {
      bySinner[sinnerId]?.sort(
        (a, b) => b.syncGrade - a.syncGrade || a.identityId.localeCompare(b.identityId),
      );
    }

    return { bySinner };
  },

  
};
