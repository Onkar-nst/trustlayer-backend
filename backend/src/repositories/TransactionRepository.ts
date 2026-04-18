import { PrismaClient } from '@prisma/client';
import { CreateTransactionDTO, TransactionStatus } from '../types/transaction.types';

const prisma = new PrismaClient();

export class TransactionRepository {
  async create(data: CreateTransactionDTO) {
    return prisma.transaction.create({ data });
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, profile: true } },
        receiver: { select: { id: true, profile: true } },
      },
    });
  }

  async findByUser(userId: string, skip: number = 0, take: number = 10) {
    return prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, profile: true } },
        receiver: { select: { id: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async updateStatus(id: string, status: TransactionStatus, completedAt?: Date) {
    return prisma.transaction.update({
      where: { id },
      data: { status, completedAt },
    });
  }
}
