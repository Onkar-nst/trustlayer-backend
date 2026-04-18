import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trustlayer.com' },
    update: { passwordHash: adminHash },
    create: {
      email: 'admin@trustlayer.com',
      passwordHash: adminHash,
      role: 'admin',
      profile: {
        create: { displayName: 'System Administrator', isPublic: false }
      },
      trustScore: { create: {} }
    }
  });

  // 2. Demo User (Verified)
  const demo = await prisma.user.upsert({
    where: { email: 'demo@trustlayer.com' },
    update: { passwordHash: passwordHash },
    create: {
      email: 'demo@trustlayer.com',
      passwordHash,
      profile: {
        create: { displayName: 'Demo User', bio: 'I am a verified tester' }
      },
      trustScore: {
        create: { total: 70, identityBonus: 20 }
      },
      identity: {
        create: {
          documentType: 'PASSPORT',
          documentUrl: 'https://example.com/demo-id.jpg',
          status: 'VERIFIED',
          reviewedBy: admin.id,
          reviewedAt: new Date()
        }
      }
    }
  });

  // 3. Alice (Pending)
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: { passwordHash: passwordHash },
    create: {
      email: 'alice@example.com',
      passwordHash,
      profile: {
        create: { displayName: 'Alice Wonder' }
      },
      trustScore: { create: {} },
      identity: {
        create: {
          documentType: 'GOVT_ID',
          documentUrl: 'https://example.com/alice-id.jpg',
          status: 'PENDING'
        }
      }
    }
  });

  // 4. Bob (Unverified)
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: { passwordHash: passwordHash },
    create: {
      email: 'bob@example.com',
      passwordHash,
      profile: {
        create: { displayName: 'Bob Builder' }
      },
      trustScore: { create: {} }
    }
  });

  console.log('Seed: Users created');

  // 5. Transactions
  const t1 = await prisma.transaction.create({
    data: {
      senderId: demo.id,
      receiverId: alice.id,
      amount: 150.00,
      type: 'PAYMENT',
      status: 'COMPLETED',
      description: 'Consulting services',
      completedAt: new Date()
    }
  });

  const t2 = await prisma.transaction.create({
    data: {
      senderId: alice.id,
      receiverId: bob.id,
      amount: 50.00,
      type: 'TRANSFER',
      status: 'COMPLETED',
      description: 'Pizza split',
      completedAt: new Date()
    }
  });

  const t3 = await prisma.transaction.create({
    data: {
      senderId: bob.id,
      receiverId: demo.id,
      amount: 200.00,
      type: 'ESCROW',
      status: 'PENDING',
      description: 'Project milestone 1'
    }
  });

  console.log('Seed: Transactions created');

  // 6. Reviews
  await prisma.review.create({
    data: {
      authorId: demo.id,
      subjectId: alice.id,
      transactionId: t1.id,
      rating: 5,
      body: 'Excellent communication and work!',
    }
  });

  await prisma.review.create({
    data: {
      authorId: alice.id,
      subjectId: bob.id,
      transactionId: t2.id,
      rating: 4,
      body: 'Thanks for the quick transfer.',
    }
  });

  console.log('Seed: Reviews created');

  // 7. Disputes
  await prisma.dispute.create({
    data: {
      raisedById: demo.id,
      targetTransactionId: t3.id,
      reason: 'Work not delivered according to specs',
      status: 'OPEN'
    }
  });

  console.log('Seed: Disputes created');
  console.log('🚀 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
