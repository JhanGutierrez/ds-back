import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class ReportSuggestionFilterDto {

  @ApiPropertyOptional({ description: 'Buscar por código del material.', required: true })
  @IsString()
  centroAbastecedor!: string;
}
