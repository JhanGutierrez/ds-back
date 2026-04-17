import bcrypt from 'bcrypt';
import { PrismaClient } from '../../generated/prisma/client';

export async function usersSeed(prisma: PrismaClient): Promise<void> {
  const defaultPassword = await bcrypt.hash('Test1234!', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.createMany({
    data: [
      {
        correo: 'admin@empresa.com',
        nombreUsuario: 'admin_compras',
        nombre: 'Admin',
        apellido: 'Sistema',
        contrasena: adminPassword,
      },
      {
        correo: 'jaime.torres@empresa.com',
        nombreUsuario: 'jaime.torres',
        nombre: 'Jaime Andres',
        apellido: 'Torres',
        contrasena: defaultPassword,
      },
      {
        correo: 'lina.garcia@empresa.com',
        nombreUsuario: 'lina.garcia',
        nombre: 'Lina',
        apellido: 'Garcia Cano',
        contrasena: defaultPassword,
      },
      {
        correo: 'rafael.saavedra@empresa.com',
        nombreUsuario: 'rafael.saavedra',
        nombre: 'Rafael',
        apellido: 'Saavedra',
        contrasena: defaultPassword,
      },
      {
        correo: 'edwin.rubio@empresa.com',
        nombreUsuario: 'edwin.rubio',
        nombre: 'Edwin',
        apellido: 'Rubio Diaz',
        contrasena: defaultPassword,
      },
      {
        correo: 'viviana.hincapie@empresa.com',
        nombreUsuario: 'viviana.hincapie',
        nombre: 'Viviana',
        apellido: 'Hincapie',
        contrasena: defaultPassword,
      },
      {
        correo: 'cristian.vasquez@empresa.com',
        nombreUsuario: 'cristian.vasquez',
        nombre: 'Cristian',
        apellido: 'Vasquez',
        contrasena: defaultPassword,
      },
      {
        correo: 'dario.castro@empresa.com',
        nombreUsuario: 'dario.castro',
        nombre: 'Dario',
        apellido: 'Castro',
        contrasena: defaultPassword,
      },
      {
        correo: 'juan.serna@empresa.com',
        nombreUsuario: 'juan.serna',
        nombre: 'Juan',
        apellido: 'Serna',
        contrasena: defaultPassword,
      },
      {
        correo: 'alvaro.javier@empresa.com',
        nombreUsuario: 'alvaro.javier',
        nombre: 'Alvaro',
        apellido: 'Javier',
        contrasena: defaultPassword,
      },
      {
        correo: 'juandavid.dottor@empresa.com',
        nombreUsuario: 'juandavid.dottor',
        nombre: 'Juan David',
        apellido: 'Dottor',
        contrasena: defaultPassword,
      },
      {
        correo: 'daniel.rojas@empresa.com',
        nombreUsuario: 'daniel.rojas',
        nombre: 'Daniel',
        apellido: 'Rojas',
        contrasena: defaultPassword,
      },
      {
        correo: 'carolina@empresa.com',
        nombreUsuario: 'carolina',
        nombre: 'Carolina',
        apellido: 'Doe',
        contrasena: defaultPassword,
      },
    ],
    skipDuplicates: true,
  });
}
