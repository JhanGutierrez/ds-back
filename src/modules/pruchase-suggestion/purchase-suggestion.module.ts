import { Module } from '@nestjs/common';
import { PurchaseSuggestionService } from './purchase-suggestion.service';
import { PurchaseSuggestionController } from './purchase-suggestion.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [PurchaseSuggestionController],
  providers: [PurchaseSuggestionService, PrismaService],
})
export class PurchaseSuggestionModule {}
