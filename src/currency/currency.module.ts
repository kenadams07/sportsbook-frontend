import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Currency } from './currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
