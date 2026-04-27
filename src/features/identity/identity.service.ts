// services/meIdentitiesService.ts
import { meIdentitiesRepository } from './identity.repositories';

export const meIdentitiesService = {
  async getMeIdentities(userId: string) {
    // 여기에 “정렬 규칙”이 있으면 서비스에서 결정
    return meIdentitiesRepository.findIdentitiesByUserId(userId);
  },

  async postIdentities(userId: string, identityIds: string[]) {
    if (!identityIds?.length) throw new Error('identityIds is required');

    return meIdentitiesRepository.postIdentities(userId, identityIds);
  },
};
