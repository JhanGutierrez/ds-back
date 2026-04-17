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

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this._prismaService.user.findFirst({
      where: { correo: data.email },
      select: {
        roles: { include: { rol: true } },
        contrasena: true,
        correo: true,
        id: true,
      },
    });

    if (!user) {
      console.error('[AuthService][login] Error: Credenciales inválidas');
      throw new AppException('Credenciales inválidas', 'CREDENCIALES_INVALIDAS', 401);
    }

    const decryptedPassword = await bcrypt.compare(
      data.password,
      user.contrasena,
    );

    if (!decryptedPassword) {
      console.error('[AuthService][login] Error: Credenciales inválidas');
      throw new AppException('Credenciales inválidas', 'CREDENCIALES_INVALIDAS', 401);
    }

    const roles = user.roles.map((r) => r.rol.nombre);
    const payload = { correo: user.correo, sub: user.id, roles };
    const access_token = this._jwtService.sign(payload);
    return { access_token };
  }

  public decodeToken(token: string) {
    try {
      return this._jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      console.error('[AuthService][decodeToken] Error:', error);
      throw new AppException(
        'Token inválido o expirado',
        'TOKEN_INVALIDO',
        401,
        error instanceof Error ? error.message : 'Error desconocido',
      );
    }
  }
}
