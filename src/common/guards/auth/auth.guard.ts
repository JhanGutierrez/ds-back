import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppException } from 'src/common/exceptions/app.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppException(
        'Authentication token not found',
        'AUTH_TOKEN_MISSING',
        401,
      );
    }

    try {
      const payload = await this._jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;
    } catch (error) {
      throw new AppException(
        'Invalid or expired token',
        'AUTH_TOKEN_INVALID',
        401,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'] as string | undefined;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}