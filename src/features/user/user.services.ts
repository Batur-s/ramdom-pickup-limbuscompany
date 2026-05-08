// services/meService.ts
import { userRepository } from './user.repositories';

export const meService = {
  async getMe(userId: string) {
    return userRepository.findMeById(userId);
  },

  async updateNickName(userId: string, nickName: string) {
    if (!nickName.trim()) throw new Error('닉네임을 입력해주세요');
    return userRepository.updateNickName(userId, nickName);
  },
};
