import bcrypt from 'bcrypt';
import { PrismaClient } from '../../generated/prisma/client';

export async function usersSeed(prisma: PrismaClient): Promise<void> {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;`,
  );
  await prisma.user.create({
    data: {
      email: 'admin@empresa.com',
      username: 'admin_compras',
      firstName: 'Admin',
      lastName: 'Sistema',
      password: hashedPassword,
    },
  });
}
