import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { PurchaseSuggestionStatus } from "src/common/enums/purchase-suggeston-status.enum";

export class PurchaseStatusBulkDto  {
  @ApiProperty({ type: [Number], required: true })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({ each: true })
  ids!: number[];

  @ApiProperty({ required: true })
  @IsEnum(PurchaseSuggestionStatus)
  @IsNotEmpty()
  codigo_estado!: PurchaseSuggestionStatus;
}