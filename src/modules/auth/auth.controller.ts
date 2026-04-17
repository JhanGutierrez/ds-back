import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiSuccessResponse } from 'src/common/decorators/api-response-data.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-responde.decorator';
import { ApiOperation } from '@nestjs/swagger';

@ApiSuccessResponse(200, 'Inicio de sesión exitoso', { acces_token: 'abejH013...' })
@ApiErrorResponse(401, 'CREDENCIALES_INVALIDAS', 'Credenciales inválidas')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión', description: 'Permite a un usuario iniciar sesión en el sistema.' })
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
