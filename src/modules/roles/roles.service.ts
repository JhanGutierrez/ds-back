import { Injectable } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly _prismaService: PrismaService) {}

  async findAll() {
    try {
      const data = await this._prismaService.role.findMany();
      return data;
    } catch (error) {
      console.log('[RolesService][findAll] Error:', error);
      if (error instanceof AppException) throw error;
      throw new AppException(
        'Error inesperado al obtener los roles',
        'ERROR_INTERNO',
        500,
      );
    }
  }
}
