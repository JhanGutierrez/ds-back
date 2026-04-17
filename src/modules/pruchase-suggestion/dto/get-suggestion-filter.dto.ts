import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PurchaseSuggestionStatus } from 'src/common/enums/purchase-suggeston-status.enum';

export class GetSuggestionFilterDto {
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

  @ApiPropertyOptional({ description: 'Buscar por centro abastecedor.', required: true })
  @IsString()
  centroAbastecedor!: string;

  @ApiPropertyOptional({ description: 'Buscar por código del material.' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  codigoMaterial?: number;

  @ApiPropertyOptional({
    enum: PurchaseSuggestionStatus,
    description: 'Estado de la sugerencia de compra.',
  })
  @IsOptional()
  @IsEnum(PurchaseSuggestionStatus)
  estado?: PurchaseSuggestionStatus;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orden?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    enum: [
      'codigoMaterial',
      'fechaCreacion',
      'fechaEstimadaEntrega',
      'proveedor',
      'alertaStock',
      'estado',
    ],
    default: 'fechaCreacion',
  })
  @IsOptional()
  @IsString()
  ordenarPor?: string = 'fechaCreacion';
}
