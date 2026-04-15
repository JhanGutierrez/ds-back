import { PrismaClient } from '../../generated/prisma/client';

export async function purchaseSuggestionsSeed(
  prisma: PrismaClient,
): Promise<void> {
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
      purchaseStatusId: 1,
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
      purchaseStatusId: 2,
    },
    {
      materialCode: '12000310',
      materialDescription: 'PASTA RIGATE 500G',
      supplier: 'DISTRIBUIDORA GLOBAL',
      supplyCenter: '7B02',
      warehouse: '100',
      leadTime: 10,
      finalInventoryDaysQuantity: 20,
      orderToday: 500,
      purchaseStatusId: 3,
    },
  ];

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "purchase_suggestions" RESTART IDENTITY CASCADE;`,
  );

  for (const item of suggestionsData) {
    await prisma.purchaseSuggestion.create({
      data: {
        ...item,
        createdById: 1,
        history: {
          create: {
            userId: 1,
            action: 'CREATE',
            changes: { info: 'Carga inicial por sistema' },
          },
        },
      },
    });
  }
}
