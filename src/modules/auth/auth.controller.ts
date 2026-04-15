import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiSuccessResponse } from 'src/common/decorators/api-response-data.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-responde.decorator';

@ApiSuccessResponse(200, 'Login sucessful', { acces_token: 'abejH013...' })
@ApiErrorResponse(401, 'INVALID_CREDENTIALS', 'Invalid credentials')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
