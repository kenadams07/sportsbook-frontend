import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportBets } from './sportBets.entity';
import { UsersService } from '../users/users.service';
import { ExposureService } from '../exposure/exposure.service';
import { Exposure } from '../exposure/exposure.entity';
import { BetStatus, SelectionType, BettingType } from './sportBets.entity';
import { Users } from '../users/users.entity';
import { AppGateway } from '../app.gateway';

@Injectable()
export class SportBetsService {
  constructor(
    @InjectRepository(SportBets)
    private sportBetsRepository: Repository<SportBets>,
    @InjectRepository(Exposure)
    private exposureRepository: Repository<Exposure>,
    private usersService: UsersService,
    private appGateway: AppGateway,
  ) {}

  findAll(): Promise<SportBets[]> {
    return this.sportBetsRepository.find();
  }

  create(sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsRepository.save(sportBet);
  }

  async placeBet(betData: any): Promise<any> {
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
    
    const user = await this.usersService.findOneById(betData.userId);
    if (!user) {
      throw new Error('User not found');
    }
    newBet.user = user;
    
    const savedBet = await this.sportBetsRepository.save(newBet);
    
    await this.calculateAndSaveExposure(betData.userId, betData.eventId, betData.marketId, betData.runnername);
    
    return {
      success: true,
      bet: savedBet,
    };
  }

  private async calculateAndSaveExposure(userId: string, eventId: string, marketId: string, runnerName: string): Promise<void> {
    const userBets = await this.sportBetsRepository.find({
      where: {
        user: { id: userId },
        eventId: eventId,
      },
      relations: ['user'],
    });

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

    const exposureValue = this.calculateExposureForRunner(userBets, runnerName, marketId);
    
    exposure.exposure = exposureValue.toString();
    
    await this.exposureRepository.save(exposure);
    
    const userExposures = await this.exposureRepository.find({
      where: {
        user: { id: userId },
        is_clear: 'false'
      }
    });
    
    const totalExposure = userExposures.reduce((total, exp) => {
      return total + parseFloat(exp.exposure || '0');
    }, 0);
    
    this.appGateway.emitExposureUpdate(userId, totalExposure);
  }

  private calculateExposureForRunner(bets: SportBets[], runnerName: string, marketId: string): number {
    const uniqueSelections = [...new Set(bets.map(bet => bet.selection))];
    
    const formattedBets = bets.map(bet => ({
      type: bet.selectionType,
      outcome: bet.selection,
      odds: bet.odds,
      stake: bet.stake
    }));
    
    const exposureResult = this.calcExposure(formattedBets, uniqueSelections);
    
    return exposureResult.exposure;
  }

  private calcExposure(bets: any[], possibleOutcomes: string[]): { netPnl: Record<string, number>, exposure: number } {
    const netPnl: Record<string, number> = {};

    for (const outcome of possibleOutcomes) {
      let net = 0;

      for (const b of bets) {
        if (b.type === "back") {
          net += (b.outcome === outcome) ? (b.odds - 1) * b.stake : -b.stake;
        }
      }

      netPnl[outcome] = Number(net.toFixed(2));
    }

    const minPnl = Math.min(...Object.values(netPnl));
    const exposure = Math.max(0, -minPnl);

    return { netPnl, exposure };
  }
}