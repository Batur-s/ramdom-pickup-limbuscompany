import prisma from '../../lib/prisma';
import * as userRepository from './user.repository';

export const syncInventory = async (userId: string, identityIds: number[]) => {
  // 비즈니스 로직: "기존걸 지우고 새로 만든다"는 정책을 트랜잭션으로 묶음
  return await prisma.$transaction(async (tx) => {
    await userRepository.deleteIndentitiesByUserId(tx, userId);

    const data = identityIds.map((id) => ({ userId, identityId: id }));
    return await userRepository.createManyIdentities(tx, data);
  });
};
