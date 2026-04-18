import { PrismaClient } from '@prisma/client';
import { CreateReviewDTO } from '../types/review.types';

const prisma = new PrismaClient();

export class ReviewRepository {
  async create(data: CreateReviewDTO) {
    return prisma.review.create({ data });
  }

  async findByUser(userId: string, skip: number = 0, take: number = 10) {
    return prisma.review.findMany({
      where: { subjectId: userId, status: 'ACTIVE' },
      include: {
        author: { select: { id: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findByAuthor(userId: string, skip: number = 0, take: number = 10) {
    return prisma.review.findMany({
      where: { authorId: userId },
      include: {
        subject: { select: { id: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findById(id: string) {
    return prisma.review.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return prisma.review.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.review.update({
      where: { id },
      data: { status: 'HIDDEN' },
    });
  }
}
