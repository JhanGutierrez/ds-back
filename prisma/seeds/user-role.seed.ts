import { PrismaClient } from '../../generated/prisma/client';

export async function userRoleSeed(prisma: PrismaClient): Promise<void> {
  const assignments: { correo: string; rolNombre: string }[] = [
    { correo: 'admin@empresa.com', rolNombre: 'ADMIN' },
    { correo: 'jaime.torres@empresa.com', rolNombre: 'GERENTE_PLANEACION' },
    { correo: 'lina.garcia@empresa.com', rolNombre: 'SAR' },
    { correo: 'rafael.saavedra@empresa.com', rolNombre: 'SAR' },
    { correo: 'edwin.rubio@empresa.com', rolNombre: 'SAR' },
    { correo: 'viviana.hincapie@empresa.com', rolNombre: 'SAN' },
    { correo: 'cristian.vasquez@empresa.com', rolNombre: 'SAN' },
    { correo: 'dario.castro@empresa.com', rolNombre: 'SUBGERENTE_PLANEACION' },
    { correo: 'juan.serna@empresa.com', rolNombre: 'SUBGERENTE_PLANEACION' },
    { correo: 'alvaro.javier@empresa.com', rolNombre: 'SAN_IMPORTADOS' },
    { correo: 'juandavid.dottor@empresa.com', rolNombre: 'GERENTE_ABASTECIMIENTO_REGIONAL' },
    { correo: 'daniel.rojas@empresa.com', rolNombre: 'GERENTE_ABASTECIMIENTO_NACIONAL' },
    { correo: 'carolina@empresa.com', rolNombre: 'GERENTE_ABASTECIMIENTO_NACIONAL' },
  ];

  for (const { correo, rolNombre } of assignments) {
    const user = await prisma.user.findUnique({ where: { correo } });
    const role = await prisma.role.findUnique({ where: { nombre: rolNombre } });

    if (!user || !role) {
      console.warn(`Skipping ${correo} → ${rolNombre}: user or role not found`);
      continue;
    }

    await prisma.userRole.upsert({
      where: { usuarioId_rolId: { usuarioId: user.id, rolId: role.id } },
      update: {},
      create: { usuarioId: user.id, rolId: role.id },
    });
  }
}
