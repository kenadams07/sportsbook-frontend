import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SportBetsService } from './sportBets.service';
import { SportBets } from './sportBets.entity';

@Controller('sportBets')
export class SportBetsController {
  constructor(private readonly sportBetsService: SportBetsService) {}

  @Get()
  findAll(): Promise<SportBets[]> {
    return this.sportBetsService.findAll();
  }

  @Get('my-bets')
  findUserBets(
    @Query('userId') userId: string,
    @Query('eventId') eventId?: string
  ) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (eventId) {
      return this.sportBetsService.findByUserIdAndEventId(userId, eventId);
    }

    return this.sportBetsService.findByUserId(userId);
  }

  @Post()
  create(@Body() sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsService.create(sportBet);
  }

  @Post('place-bet')
  async placeBet(@Body() betData: any): Promise<any> {
    return this.sportBetsService.placeBet(betData);
  }

  // New endpoint to get user bets with filtered results
  @Get('user-bets-with-results')
  async getUserBetsWithResults(
    @Query('sports_id') sportsId: string,
    @Query('event_id') eventId: string,
    @Query('user_id') userId: string
  ) {
    if (!sportsId || !eventId || !userId) {
      throw new Error('sports_id, event_id, and user_id are required');
    }

    return this.sportBetsService.getUserBetsWithResults(sportsId, eventId, userId);
  }
}