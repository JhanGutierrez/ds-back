import {
  PrismaClient,
  SuggestionStatus,
  User,
  PurchaseSuggestion,
} from '../../generated/prisma/client';

export async function purchaseSuggestionsSeed(
  prisma: PrismaClient,
  admin: User,
) {
  const suggestionsData = [
    {
      materialCode: '12000285',
      materialDescription: 'CREMA AVELLANAS CON CACAO NUZART 350 GRS',
      supplier: 'IMPORTADOS',
      supplyCenter: '6A01',
      warehouse: '900',
      leadTime: 5,
      finalInventoryDaysQuantity: 12.7,
      orderToday: 101,
      status: SuggestionStatus.OC_PENDING,
    },
    {
      materialCode: '12000290',
      materialDescription: 'ACEITE DE OLIVA EXTRA VIRGEN 500 ML',
      supplier: 'PROVEEDOR LOCAL',
      supplyCenter: '6A01',
      warehouse: '900',
      leadTime: 3,
      finalInventoryDaysQuantity: 8.5,
      orderToday: 50,
      status: SuggestionStatus.REVIEWED,
    },
    {
      materialCode: '12000310',
      materialDescription: 'PASTA PENNE RIGATE 500G',
      supplier: 'DISTRIBUIDORA GLOBAL',
      supplyCenter: '7B02',
      warehouse: '100',
      leadTime: 10,
      finalInventoryDaysQuantity: 20,
      orderToday: 500,
      status: SuggestionStatus.DRAFT,
    },
  ];

  const items: PurchaseSuggestion[] = [];

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "purchase_suggestions" RESTART IDENTITY CASCADE;`,
  );

  for (const item of suggestionsData) {
    const suggestion = await prisma.purchaseSuggestion.create({
      data: {
        ...item,
        createdById: admin.id,
        history: {
          create: {
            userId: admin.id,
            action: 'CREATE',
            changes: { info: 'Carga inicial por sistema' },
          },
        },
      },
    });
    items.push(suggestion);
  }

  return items;
}
