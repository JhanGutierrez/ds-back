import { PrismaClient } from '../../generated/prisma/client';

export async function rolesSeed(prisma: PrismaClient): Promise<void> {
  await prisma.role.createMany({
    data: [
      { nombre: 'ADMIN' },
      { nombre: 'GERENTE_PLANEACION' },
      { nombre: 'SAR' },
      { nombre: 'SAN' },
      { nombre: 'SUBGERENTE_PLANEACION' },
      { nombre: 'SAN_IMPORTADOS' },
      { nombre: 'GERENTE_ABASTECIMIENTO_REGIONAL' },
      { nombre: 'GERENTE_ABASTECIMIENTO_NACIONAL' },
    ],
    skipDuplicates: true,
  });
}