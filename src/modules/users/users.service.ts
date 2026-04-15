import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly _prismaService: PrismaService) {}

  findOne(where: Prisma.UserWhereInput) {
    const user = this._prismaService.user.findFirst({
      where,
      select:{
        id: true,
        email: true,
        username: true,
      }
    });
    return user;
  }
}
