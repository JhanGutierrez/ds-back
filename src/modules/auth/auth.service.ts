import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AppException } from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
  ) {}

  async login(
    data: LoginDto,
  ): Promise<{ access_token: string }> {
    const user = await this._prismaService.user.findFirst({
      where: { email: data.email },
      select: {
        roles: { include: { role: true } },
        password: true,
        email: true,
        id: true,
      },
    });

    if (!user)
      throw new AppException('Invalid credentials', 'INVALID_CREDENTIALS', 401);

    const decryptedPassword = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!decryptedPassword)
      throw new AppException('Invalid credentials', 'INVALID_CREDENTIALS', 401);

    const roles = user.roles.map((r) => r.role.name);
    const payload = { email: user.email, sub: user.id, roles };
    const access_token = this._jwtService.sign(payload);
    return { access_token };
  }

  public decodeToken(token: string) {
    try {
      return this._jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new AppException(
        'Invalid or expired token',
        'AUTH_TOKEN_INVALID',
        401,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
