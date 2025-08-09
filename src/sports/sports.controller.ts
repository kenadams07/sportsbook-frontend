import { Controller, Get, Post, Body } from '@nestjs/common';
import { SportsService } from './sports.service';
import { Sports } from './sports.entity';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  findAll(): Promise<Sports[]> {
    return this.sportsService.findAll();
  }

  @Post()
  create(@Body() sports: Partial<Sports>): Promise<Sports> {
    return this.sportsService.create(sports);
  }
}
