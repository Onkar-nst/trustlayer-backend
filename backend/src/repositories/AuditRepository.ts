import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditRepository {
  async create(data: any) {
    return prisma.auditLog.create({ data });
  }

  async findByUser(userId: string, skip: number = 0, take: number = 10) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findAll(skip: number = 0, take: number = 10) {
    return prisma.auditLog.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }
}
