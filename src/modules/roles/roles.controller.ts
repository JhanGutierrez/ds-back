import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiSuccessResponse } from 'src/common/decorators/api-response-data.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-responde.decorator';
import { ROLES_EXAMPLE } from './docs/roles.docs';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiSuccessResponse(200, 'Operación exitosa', [ROLES_EXAMPLE])
  @ApiErrorResponse(
    500,
    'ERROR_INTERNO',
    'Error inesperado al obtener los roles.',
  )
  @ApiOperation({
    summary: 'Obtener roles',
    description: 'Permite obtener una lista de roles.',
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}