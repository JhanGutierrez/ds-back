import { PrismaClient } from '../../generated/prisma/client';

export async function purchaseSuggestionStatusSeed(
  prisma: PrismaClient,
): Promise<void> {
  await prisma.purchaseSuggestionStatus.createMany({
    data: [
      { codigo: 'borrador', nombre: 'Borrador' },
      { codigo: 'revisado', nombre: 'Revisado' },
      { codigo: 'por_aprobar', nombre: 'Por Aprobar' },
      { codigo: 'oc_pendiente', nombre: 'OC Pendiente' },
      { codigo: 'oc_generada', nombre: 'OC Generada' },
    ],
    skipDuplicates: true,
  });
}
