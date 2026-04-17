import { Injectable } from '@nestjs/common';
import { PurchaseStatusBulkDto } from './dto/purchase-status-bulk.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { GetSuggestionFilterDto } from './dto/get-suggestion-filter.dto';
import { Prisma } from 'generated/prisma/client';
import { SetPurchaseReviewDto } from './dto/set-purchase-review.dto';
import { PassThrough } from 'node:stream';
import { formatCsvField } from 'src/common/helpers/format-csv-field';
import { ReportSuggestionFilterDto } from './dto/report-suggestion-filter.dto';

const COMMON_FIELDS = {
  id: true,
  descripcionMaterial: true,
  proveedor: true,
  centroAbastecedor: true,
  almacen: true,
  ltReal: true,
  diasInvCantidadDefinitiva: true,
  pedidoHoy: true,
  estado: true,
  alertaStock: true,
  codigoMaterial: true,
};
@Injectable()
export class PurchaseSuggestionService {
  constructor(private readonly _prismaService: PrismaService) {}

  public async getSuggestions(filter: GetSuggestionFilterDto) {
    try {
      const { limite = 10, pagina = 1, orden, ordenarPor, ...filters } = filter;

      const conditions: Prisma.PurchaseSuggestionWhereInput = {};

      conditions.centroAbastecedor = {
        contains: filters.centroAbastecedor,
        mode: 'insensitive',
      };

      if (filters.codigoMaterial)
        conditions.codigoMaterial = filters.codigoMaterial;

      if (filters.estado) conditions.estado = filters.estado;

      const [total, data] = await Promise.all([
        this._prismaService.purchaseSuggestion.count({ where: conditions }),
        this._prismaService.purchaseSuggestion.findMany({
          where: conditions,
          take: limite,
          skip: (pagina - 1) * limite,
          orderBy: { [ordenarPor ?? 'fechaCreacion']: orden ?? 'desc' },
          select: { ...COMMON_FIELDS, estadoCompraSugerida: true },
        }),
      ]);

      return {
        meta: { total, pagina, ultimaPagina: Math.ceil(total / limite) },
        data,
      };
    } catch (error) {
      console.error(
        '[PurchaseSuggestionService][getSuggestions] Error:',
        error,
      );
      if (error instanceof AppException) throw error;

      throw new AppException(
        'Error inesperado al obtener las sugerencias de compra',
        'ERROR_INTERNO',
        500,
      );
    }
  }

  async bulkStatus(data: PurchaseStatusBulkDto, req: Request) {
    try {
      const userData = req['user'];

      return await this._prismaService.$transaction(async (tx) => {
        const ids = Array.from(new Set(data.ids));
        const status = await tx.purchaseSuggestion.findMany({
          where: { id: { in: ids } },
        });

        const notFound = ids.filter((id) => !status.some((s) => s.id === id));

        if (notFound.length > 0) {
          throw new AppException(
            'Estado de compra no encontrado',
            'ESTADO_COMPRA_NO_ENCONTRADO',
            404,
            { noEncontrados: notFound },
          );
        }

        await tx.purchaseSuggestion.updateMany({
          where: { id: { in: ids } },
          data: { estado: data.codigo_estado },
        });

        await tx.purchaseSuggestionHistory.createMany({
          data: ids.map((id) => ({
            compraSugeridaId: id,
            usuarioId: userData.sub,
            accion: 'UPDATE',
            cambios: { estado: data.codigo_estado },
          })),
        });

        return {
          statusCode: 200,
          message: `Todas las sugerencias de compra han sido actualizadas.`,
          data: {
            idsActualizados: ids,
            totalActualizados: ids.length,
          },
        };
      });
    } catch (error) {
      console.error('[PurchaseSuggestionService][bulkStatus] Error:', error);
      if (error instanceof AppException) throw error;

      throw new AppException(
        'Error inesperado al actualizar las sugerencias de compra',
        'ERROR_INTERNO',
        500,
      );
    }
  }

  public async setInReview(data: SetPurchaseReviewDto) {
    try {
      const purchaseSuggestion =
        await this._prismaService.purchaseSuggestion.update({
          where: { id: data.id },
          data: { estado: 'revisado', pedidoHoy: data.pedidoHoy },
          select: {
            id: true,
            descripcionMaterial: true,
            codigoMaterial: true,
            estado: true,
          },
        });

      return { ordenCompra: purchaseSuggestion };
    } catch (error: unknown) {
      console.error('[PurchaseSuggestionService][setInReview] Error:', error);

      let prismaErrorCode: string | undefined;
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        prismaErrorCode = error.code;

      if (prismaErrorCode === 'P2025') {
        throw new AppException(
          'Sugerencia de compra no encontrada',
          'SUGERENCIA_COMPRA_NO_ENCONTRADA',
          404,
        );
      }

      if (error instanceof AppException) throw error;

      throw new AppException(
        'Error inesperado al actualizar la sugerencia de compra',
        'ERROR_INTERNO',
        500,
      );
    }
  }

  public async exportGeneratedOC(
    filters: ReportSuggestionFilterDto,
  ): Promise<PassThrough> {
    const total = await this._prismaService.purchaseSuggestion.count({
      where: {
        AND: [
          { estado: 'oc_generada' },
          { centroAbastecedor: filters.centroAbastecedor },
        ],
      },
    });

    if (total === 0) {
      throw new AppException(
        'No hay órdenes de compra generadas para exportar',
        'NO_ORDENES_OC_GENERADA',
        404,
      );
    }

    const stream = new PassThrough();
    this._processExport(stream, filters);
    return stream;
  }
  private async _processExport(
    stream: PassThrough,
    filters: ReportSuggestionFilterDto,
  ) {
    try {
      const batchSize = 1000;
      let lastId: number | null = null;

      stream.write(Object.keys(COMMON_FIELDS).join(',') + '\n');

      while (true) {
        const data = await this._prismaService.purchaseSuggestion.findMany({
          where: {
            AND: [
              { estado: 'oc_generada' },
              { centroAbastecedor: filters.centroAbastecedor },
            ],
          },
          take: batchSize,
          ...(lastId && { cursor: { id: lastId }, skip: 1 }),
          orderBy: { id: 'asc' },
          select: { ...COMMON_FIELDS },
        });

        if (data.length === 0) break;

        for (const row of data)
          stream.write(Object.values(row).map(formatCsvField).join(',') + '\n');

        lastId = data[data.length - 1].id;
      }
      stream.end();
    } catch (error) {
      console.error(
        '[PurchaseSuggestionService][_processExport] Error crítico:',
        error,
      );

      const err = error instanceof Error ? error : new Error(String(error));
      stream.destroy(err);
    }
  }
}
