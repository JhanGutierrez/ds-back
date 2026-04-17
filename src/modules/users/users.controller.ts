import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { USERS_EXAMPLE } from './docs/users.docs';
import { ApiSuccessResponse } from 'src/common/decorators/api-response-data.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-responde.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiSuccessResponse(200, 'Operación exitosa', [USERS_EXAMPLE], true)
  @ApiErrorResponse(
    500,
    'ERROR_INTERNO',
    'Error inesperado al obtener los usuarios.',
  )
  @ApiOperation({
    summary: 'Obtener usuarios',
    description:
      'Permite obtener una lista de usuarios filtrados por diversos criterios.',
  })
  @Get()
  findAll(@Query() filter: GetUserFilterDto) {
    return this.usersService.findAll(filter);
  }
}