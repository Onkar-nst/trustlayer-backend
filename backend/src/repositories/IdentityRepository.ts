import { PrismaClient } from '@prisma/client';
import { IdentityStatus, DocumentType } from '../types/identity.types';

const prisma = new PrismaClient();

export class IdentityRepository {
  async upsert(userId: string, data: { documentType: DocumentType; documentUrl: string; status: IdentityStatus }) {
    return prisma.identityVerification.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
  }

  async findByUserId(userId: string) {
    return prisma.identityVerification.findUnique({ where: { userId } });
  }

  async findAllPending() {
    return prisma.identityVerification.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true } } },
    });
  }

  async updateStatus(userId: string, data: { status: IdentityStatus; reviewedAt: Date; reviewedBy: string; rejectionReason?: string }) {
    return prisma.identityVerification.update({
      where: { userId },
      data,
    });
  }
}
