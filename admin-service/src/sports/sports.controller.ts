import { Controller, Get, Post, Put, Delete, Query, Body, Param } from '@nestjs/common';
import { SportsService } from './sports.service';
import { Sports } from './sports.entity';

@Controller('api/competitions')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  findAll(): Promise<Sports[]> {
    return this.sportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sports | null> {
    return this.sportsService.findOne(id);
  }

  @Post()
  create(@Body() sportsData: Partial<Sports>): Promise<Sports> {
    return this.sportsService.create(sportsData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() sportsData: Partial<Sports>): Promise<Sports | null> {
    return this.sportsService.update(id, sportsData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.sportsService.remove(id);
  }
}