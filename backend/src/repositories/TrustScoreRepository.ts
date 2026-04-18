import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TrustScoreRepository {
  async findByUserId(userId: string) {
    return prisma.trustScore.findUnique({
      where: { userId },
    });
  }

  async update(userId: string, data: any) {
    return prisma.trustScore.update({
      where: { userId },
      data: {
        ...data,
        lastRecalculatedAt: new Date(),
      },
    });
  }

  async findStats() {
    const aggregate = await prisma.trustScore.aggregate({
      _avg: { total: true },
      _count: { userId: true },
    });
    return {
      averageScore: aggregate._avg.total || 0,
      totalUsers: aggregate._count.userId,
    };
  }
}
