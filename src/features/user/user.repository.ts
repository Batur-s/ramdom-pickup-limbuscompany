import prisma from '../../lib/prisma';

export const deleteIndentitiesByUserId = async (tx: any, userId: string) => {
  return await tx.userIdentities.deleteMany({ where: { userId } });
};

export const createManyIdentities = async (tx: any, data: any[]) => {
  return await tx.userIdentities.createMany({
    data: identityIds.map((id) => ({
      userId: userId,
      identityId: id,
      syncGrade: 1, // 기본값이지만 명시적으로 넣어주기
    })),
  });
};
