import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PurchaseSuggestionModule } from './modules/pruchase-suggestion/purchase-suggestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PurchaseSuggestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
