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
    @Query('eventId') eventId?: string,
  ) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (eventId) {
      return this.sportBetsService.findByUserIdAndEventId(userId, eventId);
    }

    // When eventId is null or not provided, return only unique eventId, sportId, and marketId combinations
    return this.sportBetsService.findUniqueEventSportAndMarketIdsByUserId(
      userId,
    );
  }

  // New endpoint to get all bets for a user
  @Get('all-bets')
  findAllUserBets(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.sportBetsService.findAllUserBetsWithEventNames(userId);
  }

  @Post()
  create(@Body() sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsService.create(sportBet);
  }

  @Post('place-bet')
  async placeBet(@Body() betData: any): Promise<any> {
    return this.sportBetsService.placeBet(betData);
  }

  // Endpoint to settle market results
  @Post('settle-market')
  async settleMarketResults(
    @Body('marketId') marketId: string,
    @Body('winningSelection') winningSelection: string,
  ) {
    if (!marketId || !winningSelection) {
      throw new Error('marketId and winningSelection are required');
    }

    return this.sportBetsService.settleMarketResults(
      marketId,
      winningSelection,
    );
  }

  // New endpoint to process results and settle bets automatically
  @Post('process-results')
  async processResultAndSettleBets(
    @Body('event_id') eventId: string,
    @Body('sports_id') sportsId: string,
    @Body('market_id') marketId: string,
  ) {
    if (!eventId || !sportsId || !marketId) {
      throw new Error('event_id, sports_id, and market_id are required');
    }

    return this.sportBetsService.processResultAndSettleBets(
      eventId,
      sportsId,
      marketId,
    );
  }

  // Endpoint to get match results
  @Get('match-results')
  async getMatchResults(
    @Query('sports_id') sportsId: string,
    @Query('event_id') eventId: string,
    @Query('market_id') marketId?: string,
    @Query('user_id') userId?: string,
  ) {
    if (!sportsId || !eventId) {
      throw new Error('sports_id and event_id are required');
    }

    return this.sportBetsService.getMatchResults(
      sportsId,
      eventId,
      marketId,
      userId,
    );
  }

  // New endpoint to generate market report
  @Get('market-report')
  async generateMarketReport(
    @Query('user_id') userId: string,
    @Query('market_id') marketId?: string,
    @Query('event_id') eventId?: string,
  ) {
    if (!userId) {
      throw new Error('user_id is required');
    }

    return this.sportBetsService.generateMarketReport(
      userId,
      marketId,
      eventId,
    );
  }
}
