import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { Leagues } from './leagues.entity';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  findAll(): Promise<Leagues[]> {
    return this.leaguesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Leagues | null> {
    return this.leaguesService.findOne(id);
  }

  @Post()
  create(@Body() leagueData: Partial<Leagues>): Promise<Leagues> {
    return this.leaguesService.create(leagueData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() leagueData: Partial<Leagues>): Promise<Leagues | null> {
    return this.leaguesService.update(id, leagueData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.leaguesService.remove(id);
  }
}