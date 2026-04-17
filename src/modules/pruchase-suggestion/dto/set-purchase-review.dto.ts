import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SetPurchaseReviewDto {
  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @IsNotEmpty()
  pedidoHoy!: number;
}