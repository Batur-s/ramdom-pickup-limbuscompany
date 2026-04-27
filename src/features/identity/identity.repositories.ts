// repositories/meIdentitiesRepository.ts
import prisma from '../../lib/prisma';

export const meIdentitiesRepository = {
  async findIdentitiesByUserId(userId: string) {
    return prisma.userIdentity
      .findMany({
        where: { userId },
        include: {
          identity: {
            select: {
              id: true,
              name: true,
              tier: true,
              grade: true,
              sinnerId: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { identityId: 'asc' },
      })
      .then((rows) =>
        rows.map((r) => ({
          userIdentityId: r.id,
          identityId: r.identityId,
          sinnerId: r.identity.sinnerId,
          syncGrade: r.syncGrade,
          identity: r.identity,
        })),
      );
  },

  async postIdentities(userId: string, identityIds: string[]) {
    return prisma.userIdentity.createMany({
      data: identityIds.map((identityId) => ({
        userId,
        identityId,
        syncGrade: 1,
      })),
      skipDuplicates: true,
    });
  },
};
