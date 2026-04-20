// services/meService.ts
import { userRepository } from './user.repositories';

export const meService = {
  async getMe(userId: string) {
    // (선택) 권한 체크/존재 확인 로직이 있으면 여기서 처리
    return userRepository.findMeById(userId);
  },
};
