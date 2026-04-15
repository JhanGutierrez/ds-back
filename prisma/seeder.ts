import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { usersSeed } from './seeds/users.seed';
import { purchaseSuggestionsSeed } from './seeds/suggestions.seed';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await usersSeed(prisma);
  await purchaseSuggestionsSeed(prisma, admin);
  console.log('🌱  Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
