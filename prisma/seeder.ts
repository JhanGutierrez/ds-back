import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { usersSeed } from './seeds/users.seed';
import { purchaseSuggestionsSeed } from './seeds/suggestions.seed';
import { rolesSeed } from './seeds/roles.seed';
import { userRoleSeed } from './seeds/user-role.seed';
import readline from 'node:readline';
import { purchaseSuggestionStatusSeed } from './seeds/purchase-suggestion-status.seed';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const env = process.env.NODE_ENV || 'unknown';

  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Seeding is disabled in production!');
    process.exit(1);
  }

  console.log(`⚠️ You are running seeds in: ${env.toUpperCase()}`);
  const answer = await askQuestion('🌱 Are you sure you want to continue? (y/n): ');

  if (answer !== 'y') {
    console.log('❌ Seeding cancelled');
    process.exit(0);
  }

  await rolesSeed(prisma);
  await usersSeed(prisma);
  await userRoleSeed(prisma);
  await purchaseSuggestionStatusSeed(prisma);
  await purchaseSuggestionsSeed(prisma);
  console.log('🌱  Seeding completed successfully!');
}

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
