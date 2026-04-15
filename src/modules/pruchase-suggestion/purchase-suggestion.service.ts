import { Injectable } from '@nestjs/common';
import { PurchaseStatusBulkDto } from './dto/purchase-status-bulk.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { GetSuggestionFilterDto } from './dto/get-suggestion-filter.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PurchaseSuggestionService {
  constructor(private readonly _prismaService: PrismaService) {}

  async bulkStatus(data: PurchaseStatusBulkDto, req: Request) {
    try {
      const userData = req['user'];

      return await this._prismaService.$transaction(async (tx) => {
        const ids = Array.from(new Set(data.ids));
        const status = await tx.purchaseSuggestionStatus.findMany({
          where: { id: { in: ids } },
        });

        const notFound = ids.filter((id) => !status.some((s) => s.id === id));

        if (notFound.length > 0) {
          throw new AppException(
            'Purchase status not found',
            'PURCHASE_STATUS_NOT_FOUND',
            404,
            { notFound },
          );
        }

        await tx.purchaseSuggestion.updateMany({
          where: { id: { in: ids } },
          data: { purchaseStatusId: data.status_id },
        });

        await tx.purchaseHistory.createMany({
          data: ids.map((id) => ({
            purchaseId: id,
            userId: userData.sub,
            action: 'UPDATE',
            changes: { status_id: data.status_id },
          })),
        });

        return {
          statusCode: 200,
          message: `All purchase suggestions updated.`,
          data: {
            idsUpdated: ids,
            totalUpdated: ids.length,
          },
        };
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppException) throw error;

      throw new AppException(
        'Unexpected error updating purchase suggestions',
        'INTERNAL_ERROR',
        500,
      );
    }
  }

  public async getSuggestions(filter: GetSuggestionFilterDto) {
    try {
      const { limit = 10, page = 1, order, sortBy, ...filters } = filter;

      const andConditions: Prisma.PurchaseSuggestionWhereInput = {}

      if(filters.search){
        andConditions.OR = [
          { materialDescription: { contains: filters.search, mode: 'insensitive' } },
          { supplier: { contains: filters.search, mode: 'insensitive' } },
          { supplyCenter: { contains: filters.search, mode: 'insensitive' } },
        ]
      }

      if(filters.purchaseStatusId)
        andConditions.purchaseStatusId = filters.purchaseStatusId;

      const [total, data] = await Promise.all([
        this._prismaService.purchaseSuggestion.count({ where: andConditions }),
        this._prismaService.purchaseSuggestion.findMany({
          where: andConditions,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { [sortBy ?? 'createdAt']: order ?? 'desc' },
          include: {
            status: true,
            createdBy: { select: { username: true, email: true } },
          },
        }),
      ]);

      return {
        message: 'Purchase suggestions fetched successfully',
        meta: { total, page, lastPage: Math.ceil(total / limit) },
        data,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof AppException) throw error;

      throw new AppException(
        'Unexpected error fetching purchase suggestions',
        'INTERNAL_ERROR',
        500,
      );
    }
  }
}