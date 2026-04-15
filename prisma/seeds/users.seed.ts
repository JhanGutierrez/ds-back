import bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '../../generated/prisma/client';

export async function  usersSeed(prisma: PrismaClient) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    return await prisma.user.upsert({
      where: { email: 'admin@empresa.com' },
      update: {},
      create: {
        email: 'admin@empresa.com',
        username: 'admin_compras',
        firstName: 'Admin',
        lastName: 'Sistema',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });
}