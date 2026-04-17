import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class GetUserFilterDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pagina?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limite?: number = 10;

  @ApiPropertyOptional({ description: 'Buscar por correo del usuario.' })
  @IsOptional()
  @IsString()
  correo?: string;

  @ApiPropertyOptional({ description: 'Buscar por nombre de usuario.' })
  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @ApiPropertyOptional({ description: 'Buscar por roles del usuario.', enum: Role, isArray: true })
  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
