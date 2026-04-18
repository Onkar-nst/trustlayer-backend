import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTO } from '../types/user.types';

const prisma = new PrismaClient();

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        trustScore: true,
        identity: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        trustScore: true,
      },
    });
  }

  async create(data: CreateUserDTO) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        profile: {
          create: {
            displayName: data.displayName || data.email.split('@')[0],
          },
        },
        trustScore: {
          create: {}, // Base 50 defaults
        },
      },
      include: {
        profile: true,
        trustScore: true,
      },
    });
  }

  async searchPublic(query: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query } },
          { profile: { displayName: { contains: query } } },
        ],
        profile: { isPublic: true },
      },
      select: {
        id: true,
        profile: true,
        trustScore: true,
      },
    });
  }

  async findAll(skip: number = 0, take: number = 10) {
    return prisma.user.findMany({
      skip,
      take,
      include: {
        profile: true,
        trustScore: true,
      },
    });
  }
}
