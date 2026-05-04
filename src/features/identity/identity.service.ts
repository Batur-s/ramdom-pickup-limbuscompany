// services/meIdentitiesService.ts
import { meIdentitiesRepository } from './identity.repositories';

export const meIdentitiesService = {
  async getMeIdentities(userId: string) {
    return meIdentitiesRepository.findIdentitiesByUserId(userId);
  },

  async postIdentities(userId: string, identityIds: string[]) {
    if (!identityIds?.length) throw new Error('identityIds is required');

    return meIdentitiesRepository.postIdentities(userId, identityIds);
  },
};
