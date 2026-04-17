import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { Prisma } from 'generated/prisma/client';
import { AppException } from 'src/common/exceptions/app.exception';

@Injectable()
export class UsersService {
  constructor(private readonly _prismaService: PrismaService) {}
  async findAll(filter: GetUserFilterDto) {
    try {
      const { limite = 10, pagina = 1, ...filters } = filter;

      const conditions: Prisma.UserWhereInput = {};

      if (filters.correo) {
        conditions.OR = conditions.OR || [];
        conditions.OR.push({
          correo: { contains: filters.correo, mode: 'insensitive' },
        });
      }

      if (filters.nombreUsuario) {
        conditions.OR = conditions.OR || [];
        conditions.OR.push({
          nombreUsuario: {
            contains: filters.nombreUsuario,
            mode: 'insensitive',
          },
        });
      }

      if (filters.roles && filters.roles.length > 0){
        const rolesArray = Array.isArray(filters.roles) ? filters.roles : [filters.roles];
        conditions.roles = {
          some: {
            rol: { nombre: { in: rolesArray } },
          },
        };
      }

      const [data, total] = await this._prismaService.$transaction([
        this._prismaService.user.findMany({
          where: conditions,
          skip: (pagina - 1) * limite,
          take: limite,
          select: {
            id: true,
            correo: true,
            nombreUsuario: true,
            nombre: true,
            apellido: true,
            fechaCreacion: true,
            fechaActualizacion: true,
            roles: { include: { rol: true } },
          },
        }),
        this._prismaService.user.count({ where: conditions }),
      ]);

      return {
        meta: { total, pagina, ultimaPagina: Math.ceil(total / limite) },
        data,
      };
    } catch (error) {
      console.error('[UsersService][findAll] Error:', error);
      if (error instanceof AppException) throw error;

      throw new AppException(
        'Error inesperado al obtener los usuarios',
        'ERROR_INTERNO',
        500,
      );
    }
  }
}
