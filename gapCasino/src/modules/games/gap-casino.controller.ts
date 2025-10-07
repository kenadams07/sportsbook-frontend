import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GapCasinoService } from './gap-casino.service';
import { CreateGapCasinoDto } from './dto/create-gap-casino.dto';
import { UpdateGapCasinoDto } from './dto/update-gap-casino.dto';

@Controller('gap-casino')
export class GapCasinoController {
  constructor(private readonly gapCasinoService: GapCasinoService) {}

  @Post()
  create(@Body() createGapCasinoDto: CreateGapCasinoDto) {
    return this.gapCasinoService.create(createGapCasinoDto);
  }

  @Get()
  findAll() {
    return this.gapCasinoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gapCasinoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGapCasinoDto: UpdateGapCasinoDto) {
    return this.gapCasinoService.update(id, updateGapCasinoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gapCasinoService.remove(id);
  }
}