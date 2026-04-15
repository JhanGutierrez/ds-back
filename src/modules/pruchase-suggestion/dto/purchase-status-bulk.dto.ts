import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";

export class PurchaseStatusBulkDto  {
  @ApiProperty({ type: [Number], required: true })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({ each: true })
  ids!: number[];

  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  status_id!: number;
}