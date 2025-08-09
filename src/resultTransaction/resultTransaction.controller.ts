import { Controller, Get, Post, Body } from '@nestjs/common';
import { ResultTransationService } from './resultTransaction.service';
import { ResultTransaction } from './resultTransaction.entity';

@Controller('resultTransaction')
export class ResultTransactionController {
  constructor(private readonly resultTransationService: ResultTransationService) {}

  @Get()
  findAll(): Promise<ResultTransaction[]> {
    return this.resultTransationService.findAll();
  }

  @Post()
  create(@Body() resultTransation: Partial<ResultTransaction>): Promise<ResultTransaction> {
    return this.resultTransationService.create(resultTransation);
  }
}
