import { Controller, Get, Post, Body } from '@nestjs/common';
import { SportBetsService } from './sportBets.service';
import { SportBets } from './sportBets.entity';

@Controller('sportBets')
export class SportBetsController {
  constructor(private readonly sportBetsService: SportBetsService) {}

  @Get()
  findAll(): Promise<SportBets[]> {
    return this.sportBetsService.findAll();
  }

  @Post()
  create(@Body() sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsService.create(sportBet);
  }
}
