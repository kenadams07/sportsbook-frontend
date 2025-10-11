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
import { Markets } from '../markets/markets.entity';
import { MarketType, ExposureStatus } from '../markets/markets.entity';

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

  findByUserId(userId: string): Promise<SportBets[]> {
    return this.sportBetsRepository.find({
      where: {
        user: { id: userId }
      },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  findByUserIdAndEventId(userId: string, eventId: string): Promise<SportBets[]> {
    return this.sportBetsRepository.find({
      where: {
        user: { id: userId },
        eventId: eventId
      },
      order: {
        createdAt: 'DESC'
      }
    });
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

    // Fetch existing bets of this user for same event AND market
    const existingBets = await this.sportBetsRepository.find({
      where: {
        user: { id: betData.userId },
        eventId: betData.eventId,
        marketId: betData.marketId, // Add marketId filter
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
    // This is the virtual balance that user can use for placing new bets
    const availableBalance = user.balance - user.exposure;

    // Check if extra exposure needed exceeds available balance
    if (extraNeeded > 0 && extraNeeded > availableBalance) {
      throw new BadRequestException("Insufficient balance to place this bet");
    }

    // Ensure exposure never exceeds user balance
    if (newExposure > user.balance) {
      throw new BadRequestException("Exposure cannot exceed user balance");
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

    // Recalculate & save exposure for this specific market
    await this.calculateAndSaveExposure(betData.userId, betData.eventId, betData.marketId, betData.marketType, betData.runners);

    return {
      success: true,
      bet: savedBet,
    };
  }

  private async calculateAndSaveExposure(userId: string, eventId: string, marketId: string, marketType: string, runners: string[]): Promise<void> {
    // Fetch all bets for this user, event and market
    const userBets = await this.sportBetsRepository.find({
      where: {
        user: { id: userId },
        eventId: eventId,
        marketId: marketId, // Add marketId filter
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

    // Find or create exposure record for this user + market (not event)
    let exposure = await this.exposureRepository.findOne({
      where: {
        user: { id: userId },
        market: { marketId: marketId }, // Use market relationship
        eventId: eventId, // Add eventId filter
      },
    });

    // Set the market relationship properly
    // First, try to find the existing Markets record
    const marketRepo = this.sportBetsRepository.manager.getRepository(Markets);
    let market = await marketRepo.findOne({
      where: {
        marketId: marketId
      }
    });
    
    // If market doesn't exist, create it
    if (!market) {
      market = new Markets();
      market.marketId = marketId;
      // Set other required fields with default values
      market.marketName = 'Unknown Market';
      market.marketType = MarketType.ODDS; // Assuming ODDS as default
      market.status = ExposureStatus.ONE; // Assuming ONE as default
      market.marketTime = new Date();
      market = await marketRepo.save(market);
    }
    
    if (!exposure) {
      // For new records, we'll use query builder to directly set the foreign key
      await this.exposureRepository.createQueryBuilder()
        .insert()
        .into(Exposure)
        .values({
          user: { id: userId },
          market: market,
          eventId: eventId,
          marketType: marketType,
          exposure: exposureValue.toString(),
          is_clear: 'false'
        })
        .execute();
    } else {
      // For existing records, update the values
      exposure.eventId = eventId;
      exposure.marketType = marketType;
      exposure.exposure = exposureValue.toString();
      exposure.market = market;
      await this.exposureRepository.save(exposure);
    }

    // Calculate total exposure across ALL markets for this user
    const userExposures = await this.exposureRepository.find({
      where: {
        user: { id: userId },
        is_clear: 'false',
      },
    });

    const totalExposure = userExposures.reduce((total, exp) => {
      return total + parseFloat(exp.exposure || '0');
    }, 0);

    // Ensure total exposure never exceeds user balance
    const user = await this.usersService.findOneById(userId);
    if (user && totalExposure > user.balance) {
      throw new BadRequestException("Total exposure cannot exceed user balance");
    }

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