import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { Markets } from './markets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Markets])],
  providers: [MarketsService],
  controllers: [MarketsController],
})
export class MarketModule {}
