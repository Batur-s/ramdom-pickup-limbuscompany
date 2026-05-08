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

  async getAllIdentities() {
    return meIdentitiesRepository.findAll();
  },

  async deleteIdentity(userId: string, userIdentityId: string) {
    return meIdentitiesRepository.deleteIdentity(userId, userIdentityId);
  },

  async updateSyncGrade(userId: string, userIdentityId: string, syncGrade: number) {
    if (syncGrade < 1 || syncGrade > 5) throw new Error('syncGrade는 1~5 사이여야 해요');
    return meIdentitiesRepository.updateSyncGrade(userId, userIdentityId, syncGrade);
  },
};
