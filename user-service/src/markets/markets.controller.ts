import { Controller, Get, Post, Body } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { Markets } from './markets.entity';

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  findAll(): Promise<Markets[]> {
    return this.marketsService.findAll();
  }

  @Post()
  create(@Body() market: Partial<Markets>): Promise<Markets> {
    return this.marketsService.create(market);
  }
}
