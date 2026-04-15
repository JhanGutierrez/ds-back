import { PrismaClient } from '../../generated/prisma/client';

export async function rolesSeed(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "role" RESTART IDENTITY CASCADE;`,
  );

  await prisma.role.createMany({
    data: [{ name: 'ADMIN' }, { name: 'USER' }],
  });
}
