import { faker } from '@faker-js/faker';
import { PrismaClient } from '../../generated/prisma/client';

export async function purchaseSuggestionsSeed(
  prisma: PrismaClient,
  count: number,
): Promise<void> {
  const randomData = Array.from({ length: count }, () => ({
    mc: `MC${faker.number.int({ min: 100, max: 999 })}`,
    mca: `MCA${faker.number.int({ min: 100, max: 999 })}`,
    mcap: `MCAP${faker.number.int({ min: 100, max: 999 })}`,
    codigoMaterial: faker.number.int({ min: 12000000, max: 13000000 }),
    descripcionMaterial: faker.commerce.productName(),
    codProv: `PRV${faker.number.int({ min: 100, max: 999 })}`,
    proveedor: faker.company.name(),
    centroAbastecedor: `6A${faker.number.int({ min: 1, max: 10 }).toString().padStart(2, '0')}`,
    desDentro: `Centro ${faker.number.int({ min: 1, max: 10 })}`,
    porcCompra: faker.number.int({ min: 5, max: 25 }),
    almacen: faker.number.int({ min: 900, max: 910 }),
    categoria: `CATEGORIA${faker.number.int({ min: 1, max: 10 })}`,
    ltReal: faker.number.float({ min: 1, max: 20, fractionDigits: 2 }),
    factorLt: faker.number.float({ min: 1, max: 2, fractionDigits: 4 }),
    frec: faker.number.float({ min: 1, max: 5, fractionDigits: 4 }),
    ump: faker.number.int({ min: 1, max: 3 }),
    ums: faker.number.int({ min: 1, max: 3 }),
    venta30DiasDiaDelDia: faker.number.float({
      min: 5,
      max: 20,
      fractionDigits: 5,
    }),
    ventaFcDiaAjustada: faker.number.float({
      min: 5,
      max: 20,
      fractionDigits: 5,
    }),
    pedidoPromedioDiaUmp: faker.number.int({ min: 1, max: 10 }),
    activoLunes: faker.datatype.boolean(),
    activoMartes: faker.datatype.boolean(),
    activoMiercoles: faker.datatype.boolean(),
    activoJueves: faker.datatype.boolean(),
    activoViernes: faker.datatype.boolean(),
    activoSabado: faker.datatype.boolean(),
    activoDomingo: faker.datatype.boolean(),
    pedidoHoy: faker.number.int({ min: 1, max: 150 }),
  }));

  await prisma.purchaseSuggestion.createMany({
    data: randomData,
    skipDuplicates: true,
  });
}
