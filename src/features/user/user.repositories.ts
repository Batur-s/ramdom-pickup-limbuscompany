// repositories/userRepository.ts
import prisma from '../../lib/prisma';

export const userRepository = {
  async findMeById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickName: true, isNewUser: true, createdAt: true },
    });
  },
};
