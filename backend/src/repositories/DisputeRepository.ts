import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DisputeRepository {
  async create(data: any) {
    return prisma.dispute.create({ data });
  }

  async findByUser(userId: string) {
    return prisma.dispute.findMany({
      where: { raisedById: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return prisma.dispute.findMany({
      where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } },
      include: {
        raisedBy: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.dispute.findUnique({
      where: { id },
      include: { targetReview: true, targetTransaction: true },
    });
  }

  async update(id: string, data: any) {
    return prisma.dispute.update({
      where: { id },
      data,
    });
  }
}
