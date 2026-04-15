import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AppException } from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this._prismaService.user.findFirst({ where: { email: data.email } });
    if (!user)
      throw new AppException('Invalid credentials', 'INVALID_CREDENTIALS', 401);

    const decryptedPassword = await bcrypt.compare(data.password, user.password);

    if(!decryptedPassword)
      throw new AppException('Invalid credentials', 'INVALID_CREDENTIALS', 401);

    const payload = { email: user.email, sub: user.id };
    const access_token = this._jwtService.sign(payload);
    return { access_token };
  }
}
