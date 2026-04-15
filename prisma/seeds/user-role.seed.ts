import { PrismaClient, UserRole } from '../../generated/prisma/client';

export async function userRoleSeed(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "user_role" RESTART IDENTITY CASCADE;`,
  );

  const roles: UserRole[] = [
    {
      userId: 1, // Assuming the admin user created in usersSeed has an ID of 1
      roleId: 1, // Assuming the ADMIN role created in rolesSeed has an ID of 1
    },
  ];

  for (const role of roles) {
    await prisma.userRole.create({
      data: role,
    });
  }
}
