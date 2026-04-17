import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { PurchaseSuggestionService } from './purchase-suggestion.service';
import { PurchaseStatusBulkDto } from './dto/purchase-status-bulk.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/api-response-data.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-responde.decorator';
import { GetSuggestionFilterDto } from './dto/get-suggestion-filter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  BULK_STATUS_EXAMPLE,
  PURCHASE_STATUS_NOT_FOUND_EXAMPLE,
  PURCHASE_SUGGESTION_VIEW_EXAMPLE,
  SUGGESTION_EXAMPLE,
} from './docs/purchase-suggestion.docs';
import { SetPurchaseReviewDto } from './dto/set-purchase-review.dto';
import type { Response } from 'express';
import { ReportSuggestionFilterDto } from './dto/report-suggestion-filter.dto';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('purchase-suggestion')
export class PurchaseSuggestionController {
  constructor(
    private readonly purchaseSuggestionService: PurchaseSuggestionService,
  ) {}

  @Roles(
    Role.ADMIN,
    Role.SUBGERENTE_PLANEACION,
    Role.GERENTE_ABASTECIMIENTO_NACIONAL,
  )
  @ApiSuccessResponse(
    200,
    'Todas las sugerencias de compra han sido actualizadas.',
    BULK_STATUS_EXAMPLE,
  )
  @ApiErrorResponse(
    404,
    'ESTADO_COMPRA_NO_ENCONTRADO',
    'Estado de compra no encontrado',
    PURCHASE_STATUS_NOT_FOUND_EXAMPLE,
  )
  @ApiErrorResponse(
    500,
    'ERROR_INTERNO',
    'Error inesperado al actualizar las sugerencias de compra',
  )
  @ApiOperation({
    summary: 'Actualiza el estado de varias sugerencias de compra',
    description:
      'Permite cambiar el estado de múltiples sugerencias de compra en una sola petición.',
  })
  @Post('bulk/status')
  bulkStatus(@Body() data: PurchaseStatusBulkDto, @Req() req: Request) {
    return this.purchaseSuggestionService.bulkStatus(data, req);
  }

  // ----------------------------------------------

  @Roles(
    Role.ADMIN,
    Role.GERENTE_PLANEACION,
    Role.SAR,
    Role.SAN,
    Role.SUBGERENTE_PLANEACION,
    Role.SAN_IMPORTADOS,
    Role.GERENTE_ABASTECIMIENTO_REGIONAL,
    Role.GERENTE_ABASTECIMIENTO_NACIONAL,
  )
  @ApiSuccessResponse(200, 'Operación exitosa', [SUGGESTION_EXAMPLE], true)
  @ApiErrorResponse(
    500,
    'ERROR_INTERNO',
    'Error inesperado al obtener las sugerencias de compra',
  )
  @ApiOperation({
    summary: 'Obtiene sugerencias de compra',
    description:
      'Permite obtener una lista de sugerencias de compra filtradas por diversos criterios.',
  })
  @Get()
  getSuggestions(@Query() query: GetSuggestionFilterDto) {
    return this.purchaseSuggestionService.getSuggestions(query);
  }

  // ----------------------------------------------

  @Roles(
    Role.ADMIN,
    Role.GERENTE_PLANEACION,
    Role.SAR,
    Role.SAN,
    Role.SUBGERENTE_PLANEACION,
    Role.SAN_IMPORTADOS,
    Role.GERENTE_ABASTECIMIENTO_REGIONAL,
    Role.GERENTE_ABASTECIMIENTO_NACIONAL,
  )
  @ApiSuccessResponse(
    200,
    'Sugerencia de compra actualizada a estado revisado.',
    PURCHASE_SUGGESTION_VIEW_EXAMPLE,
  )
  @ApiErrorResponse(
    404,
    'SUGERENCIA_COMPRA_NO_ENCONTRADA',
    'Sugerencia de compra no encontrada',
    PURCHASE_STATUS_NOT_FOUND_EXAMPLE,
  )
  @ApiErrorResponse(
    500,
    'ERROR_INTERNO',
    'Error inesperado al actualizar la sugerencia de compra',
  )
  @ApiOperation({
    summary: 'Actualiza el estado de una sugerencia de compra a revisado',
    description:
      'Permite actualizar el estado de una sugerencia de compra a revisado.',
  })
  @Post('set-in-review')
  setInReview(@Body() data: SetPurchaseReviewDto) {
    return this.purchaseSuggestionService.setInReview(data);
  }

  // ----------------------------------------------

  @Roles(
    Role.ADMIN,
    Role.GERENTE_PLANEACION,
    Role.SUBGERENTE_PLANEACION,
    Role.GERENTE_ABASTECIMIENTO_REGIONAL,
    Role.GERENTE_ABASTECIMIENTO_NACIONAL,
  )
  @ApiProduces('text/csv')
  @ApiResponse({ schema: { type: 'string', format: 'binary' }, status: 200 })
  @ApiErrorResponse(
    404,
    'NO_ORDENES_OC_GENERADA',
    'No hay órdenes de compra generadas para exportar',
  )
  @ApiOperation({
    summary: 'Exporta las órdenes de compra generadas',
    description: 'Permite exportar órdenes de compra en formato CSV.',
  })
  @Get('export-generated-oc')
  async exportGeneratedOC(@Res() res: Response, @Query() query: ReportSuggestionFilterDto) {
    const stream = await this.purchaseSuggestionService.exportGeneratedOC(query);

    const date = new Date().toISOString().slice(0, 10);
    const filename = `ordenes_de_compra_${date}.csv`;

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    stream.pipe(res);
  }
}
