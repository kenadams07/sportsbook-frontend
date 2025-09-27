import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportBets } from './sportBets.entity';
import { UsersService } from '../users/users.service';
import { Exposure } from '../exposure/exposure.entity';
import { BetStatus, SelectionType, BettingType } from './sportBets.entity';
import { Users } from '../users/users.entity';
import { AppGateway } from '../app.gateway';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class SportBetsService {
  constructor(
    @InjectRepository(SportBets)
    private sportBetsRepository: Repository<SportBets>,
    @InjectRepository(Exposure)
    private exposureRepository: Repository<Exposure>,
    private usersService: UsersService,
    private appGateway: AppGateway,
  ) { }

  findAll(): Promise<SportBets[]> {
    return this.sportBetsRepository.find();
  }

  create(sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsRepository.save(sportBet);
  }

  async placeBet(betData: any): Promise<any> {
    // Get user
    const user = await this.usersService.findOneById(betData.userId);
    if (!user) {

      throw new BadRequestException("User not found");
    }

    // Fetch existing bets of this user for same event
    const existingBets = await this.sportBetsRepository.find({
      where: {
        user: { id: betData.userId },
        eventId: betData.eventId,
      },
      relations: ['user'],
    });

    // Format existing bets
    const formattedExisting = existingBets.map((bet) => ({
      type: bet.selectionType,
      outcome: bet.selection,
      odds: bet.odds,
      stake: bet.stake,
    }));

    // Old exposure
    const oldExposure = this.calcExposure(formattedExisting, betData.runners).exposure;

    // Add new bet (back only)
    const newBetFormatted = {
      type: SelectionType.BACK,
      outcome: betData.runnername,
      odds: parseFloat(betData.odds),
      stake: betData.stake,
    };

    const newExposure = this.calcExposure([...formattedExisting, newBetFormatted], betData.runners).exposure;

    // Extra exposure required for this new bet
    const extraNeeded = newExposure - oldExposure;

    // Available balance = user balance - user.exposure (already blocked)
    const availableBalance = user.balance - user.exposure;

    if (extraNeeded > 0 && extraNeeded > availableBalance) {
      throw new BadRequestException("Insufficient balance to place this bet");
    }

    // Save new bet
    const newBet = new SportBets();
    newBet.eventId = betData.eventId;
    newBet.sportId = betData.sportsid;
    newBet.stake = betData.stake;
    newBet.selectionType = SelectionType.BACK;
    newBet.odds = parseFloat(betData.odds);
    newBet.marketId = betData.marketId;
    newBet.selection = betData.runnername;
    newBet.marketType = betData.marketType;
    newBet.leagueId = betData.competitionId;
    newBet.selectionId = betData.runnerid;
    newBet.marketName = betData.marketName;
    newBet.bettingType = BettingType.ODDS;
    newBet.status = BetStatus.PENDING;
    newBet.user = user;

    const savedBet = await this.sportBetsRepository.save(newBet);

    // Recalculate & save exposure
    await this.calculateAndSaveExposure(betData.userId, betData.eventId, betData.runners);

    return {
      success: true,
      bet: savedBet,
    };
  }

  private async calculateAndSaveExposure(userId: string, eventId: string, runners: string[]): Promise<void> {
    // Fetch all bets for this user and event
    const userBets = await this.sportBetsRepository.find({
      where: {
        user: { id: userId },
        eventId: eventId,
      },
      relations: ['user'],
    });

    const formattedBets = userBets.map((bet) => ({
      type: bet.selectionType,
      outcome: bet.selection,
      odds: bet.odds,
      stake: bet.stake,
    }));

    // Exposure calculation
    const exposureResult = this.calcExposure(formattedBets, runners);
    const exposureValue = exposureResult.exposure;

    // Find or create exposure record for this user + event
    let exposure = await this.exposureRepository.findOne({
      where: {
        user: { id: userId },
        marketType: eventId,
      },
    });

    if (!exposure) {
      exposure = new Exposure();
      exposure.user = { id: userId } as Users;
      exposure.marketType = eventId;
      exposure.is_clear = 'false';
      exposure.exposure = '0';
    }

    exposure.exposure = exposureValue.toString();

    await this.exposureRepository.save(exposure);

    // Calculate total exposure across events for this user
    const userExposures = await this.exposureRepository.find({
      where: {
        user: { id: userId },
        is_clear: 'false',
      },
    });

    const totalExposure = userExposures.reduce((total, exp) => {
      return total + parseFloat(exp.exposure || '0');
    }, 0);

    // Update in users table
    await this.usersService.updateUserExposure(userId, totalExposure);

    // Emit socket event for frontend
    this.appGateway.emitExposureUpdate(userId, totalExposure);
  }

  private calcExposure(
    bets: any[],
    possibleOutcomes: string[],
  ): { netPnl: Record<string, number>; exposure: number } {
    const netPnl: Record<string, number> = {};

    for (const outcome of possibleOutcomes) {
      let net = 0;
      const lowerOutcome = outcome.toLowerCase();

      for (const b of bets) {
        const betOutcome = b.outcome.toLowerCase();

        if (b.type === 'back') {
          // If outcome wins -> profit, else loss of stake
          net += betOutcome === lowerOutcome ? (b.odds - 1) * b.stake : -b.stake;
        }
      }

      netPnl[outcome] = Number(net.toFixed(2));
    }

    // Minimum P/L across all outcomes -> maximum liability
    const minPnl = Math.min(...Object.values(netPnl));
    const exposure = Math.max(0, -minPnl);

    return { netPnl, exposure };
  }
}
