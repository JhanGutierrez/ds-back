import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchaseSuggestionService } from './purchase-suggestion.service';
import { PurchaseStatusBulkDto } from './dto/purchase-status-bulk.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/api-response-data.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-responde.decorator';
import { GetSuggestionFilterDto } from './dto/get-suggestion-filter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { BULK_STATUS_EXAMPLE, PURCHASE_STATUS_NOT_FOUND_EXAMPLE, SUGGESTION_EXAMPLE } from './docs/purchase-suggestion.docs';

@ApiErrorResponse(
  500,
  'INTERNAL_ERROR',
  'Unexpected error fetching purchase suggestions',
)
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('purchase-suggestion')
export class PurchaseSuggestionController {
  constructor(
    private readonly purchaseSuggestionService: PurchaseSuggestionService,
  ) {}

  @ApiSuccessResponse(200, 'All purchase suggestions updated.', BULK_STATUS_EXAMPLE)
  @ApiErrorResponse(404, 'PURCHASE_STATUS_NOT_FOUND', 'Purchase status not found', PURCHASE_STATUS_NOT_FOUND_EXAMPLE)
  @Post('bulk/status')
  bulkStatus(@Body() data: PurchaseStatusBulkDto, @Req() req: Request) {
    return this.purchaseSuggestionService.bulkStatus(data, req);
  }

  @ApiSuccessResponse(200, 'Purchase suggestions fetched successfully', [SUGGESTION_EXAMPLE], true)
  @Get()
  getSuggestions(@Query() query: GetSuggestionFilterDto) {
    return this.purchaseSuggestionService.getSuggestions(query);
  }
}