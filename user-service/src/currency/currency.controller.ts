import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  findAll(): Promise<Currency[]> {
    return this.currencyService.findAll();
  }

  @Post()
  create(@Body() currency: Partial<Currency>): Promise<Currency> {
    return this.currencyService.create(currency);
  }
}
