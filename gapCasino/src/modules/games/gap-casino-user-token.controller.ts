import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GapCasinoUserTokenService } from './gap-casino-user-token.service';
import { CreateGapCasinoUserTokenDto } from './dto/create-gap-casino-user-token.dto';
import { UpdateGapCasinoUserTokenDto } from './dto/update-gap-casino-user-token.dto';

@Controller('gap-casino-user-token')
export class GapCasinoUserTokenController {
  constructor(private readonly gapCasinoUserTokenService: GapCasinoUserTokenService) {}

  @Post()
  create(@Body() createGapCasinoUserTokenDto: CreateGapCasinoUserTokenDto) {
    return this.gapCasinoUserTokenService.create(createGapCasinoUserTokenDto);
  }

  @Get()
  findAll() {
    return this.gapCasinoUserTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gapCasinoUserTokenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGapCasinoUserTokenDto: UpdateGapCasinoUserTokenDto) {
    return this.gapCasinoUserTokenService.update(id, updateGapCasinoUserTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gapCasinoUserTokenService.remove(id);
  }
}