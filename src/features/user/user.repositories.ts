// repositories/userRepository.ts
import prisma from '../../lib/prisma';

export const userRepository = {
  async findMeById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickName: true, isNewUser: true, createdAt: true },
    });
  },

  async updateNickName(userId: string, nickName: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { nickName },
      select: { id: true, nickName: true },
    });
  },
};
