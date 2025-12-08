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

    // When eventId is null or not provided, return only unique eventId, sportId, and marketId combinations
    return this.sportBetsService.findUniqueEventSportAndMarketIdsByUserId(userId);
  }

  @Post()
  create(@Body() sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsService.create(sportBet);
  }

  @Post('place-bet')
  async placeBet(@Body() betData: any): Promise<any> {
    return this.sportBetsService.placeBet(betData);
  }

  // Endpoint to get match results
  @Get('match-results')
  async getMatchResults(
    @Query('sports_id') sportsId: string,
    @Query('event_id') eventId: string,
    @Query('market_id') marketId?: string
  ) {
    if (!sportsId || !eventId) {
      throw new Error('sports_id and event_id are required');
    }

    return this.sportBetsService.getMatchResults(sportsId, eventId, marketId);
  }
}