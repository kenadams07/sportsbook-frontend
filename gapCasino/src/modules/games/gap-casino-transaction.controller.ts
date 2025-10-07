import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GapCasinoTransactionService } from './gap-casino-transaction.service';
import { CreateGapCasinoTransactionDto } from './dto/create-gap-casino-transaction.dto';
import { UpdateGapCasinoTransactionDto } from './dto/update-gap-casino-transaction.dto';

@Controller('gap-casino-transaction')
export class GapCasinoTransactionController {
  constructor(private readonly gapCasinoTransactionService: GapCasinoTransactionService) {}

  @Post()
  create(@Body() createGapCasinoTransactionDto: CreateGapCasinoTransactionDto) {
    return this.gapCasinoTransactionService.create(createGapCasinoTransactionDto);
  }

  @Get()
  findAll() {
    return this.gapCasinoTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gapCasinoTransactionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGapCasinoTransactionDto: UpdateGapCasinoTransactionDto) {
    return this.gapCasinoTransactionService.update(id, updateGapCasinoTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gapCasinoTransactionService.remove(id);
  }
}