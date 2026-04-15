import { PrismaClient } from '../../generated/prisma/client';

export async function purchaseSuggestionStatusSeed(
  prisma: PrismaClient,
): Promise<void> {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "purchase_suggestion_status" RESTART IDENTITY CASCADE;`,
  );

  await prisma.purchaseSuggestionStatus.createMany({
    data: [
      {
        code: 'DRAFT',
        name: 'Draft',
      },
      {
        code: 'REVIEWED',
        name: 'Reviewed',
      },
      {
        code: 'TO_APPROVE',
        name: 'To Approve',
      },
      {
        code: 'OC_PENDING',
        name: 'OC Pending',
      },
    ],
  });
}
