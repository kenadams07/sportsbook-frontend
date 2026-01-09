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
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ResultTransationService } from '../resultTransaction/resultTransaction.service';
import { ResultTransaction } from '../resultTransaction/resultTransaction.entity';
import { CommissionStatus } from '../resultTransaction/resultTransaction.entity';

@Injectable()
export class SportBetsService {
  private readonly resultApiUrl: string;

  constructor(
    @InjectRepository(SportBets)
    private sportBetsRepository: Repository<SportBets>,
    @InjectRepository(Exposure)
    private exposureRepository: Repository<Exposure>,
    private usersService: UsersService,
    private appGateway: AppGateway,
    private configService: ConfigService,
    private resultTransactionService: ResultTransationService,
  ) {
    this.resultApiUrl = this.configService.get<string>('resultApiUrl', 'http://89.116.20.218:2700/result');
  }

  findAll(): Promise<SportBets[]> {
    return this.sportBetsRepository.find();
  }

  findByUserId(userId: string): Promise<SportBets[]> {
    return this.sportBetsRepository.find({
      where: {
        user: { id: userId }
      },
      relations: ['user', 'currency'], // Include necessary relations to ensure complete data
      order: {
        createdAt: 'DESC'
      }
    });
  }

  // Enhanced method to get all bets with event names
  async findAllUserBetsWithEventNames(userId: string): Promise<any[]> {
    // Get all bets for the user - without loading relations to avoid including user details
    const bets = await this.sportBetsRepository.find({
      where: {
        user: { id: userId }
      },
      order: {
        createdAt: 'DESC'
      }
    });

    // Extract unique sport IDs to make API calls
    const uniqueSportIds = [...new Set(bets.map(bet => bet.sportId))];
    
    // Fetch event details from the events API for each unique sport ID
    const eventDetailsMap = new Map<string, string>(); // Maps eventId to eventName
    const sportDetailsMap = new Map<string, string>(); // Maps sportId to sportName
    
    // Fetch events for all unique sport IDs using the correct API endpoint
    for (const sportId of uniqueSportIds) {
      try {
        // Use the exact format as specified with live_matches parameter
        const eventsResponse = await axios.get(`http://89.116.20.218:2700/events?sport_id=${sportId}&live_matches=true`);
        const eventsData = eventsResponse.data;
        
        console.log(`API Response for sport ${sportId}:`, JSON.stringify(eventsData, null, 2)); // Debug log
        
        // Process the response structure to extract event names
        if (eventsData && eventsData.sports && Array.isArray(eventsData.sports)) {
          for (const sport of eventsData.sports) {
            console.log(`Processing sport:`, sport); // Debug log
            if (sport.eventId && sport.eventName) {
              // Map the specific event ID to its event name
              eventDetailsMap.set(sport.eventId, sport.eventName);
              console.log(`Mapped event ${sport.eventId} to ${sport.eventName}`); // Debug log
            }
            
            // Also store the sport name for this sport ID
            if (sport.sportId && sport.sportName) {
              sportDetailsMap.set(sport.sportId, sport.sportName);
              console.log(`Mapped sport ${sport.sportId} to ${sport.sportName}`); // Debug log
            }
          }
        } else {
          console.log(`Unexpected API response structure for sport ${sportId}`, eventsData); // Debug log
        }
      } catch (error) {
        console.error(`Error fetching events for sport ${sportId}:`, error.message);
        if (error.response) {
          console.error(`API response status: ${error.response.status}`, error.response.data);
        }
        // If API call fails, we'll just not include the event names for this sport
      }
    }

    // Add event names and sport names to the bets
    return bets.map(bet => {
      const eventName = eventDetailsMap.get(bet.eventId);
      const sportName = sportDetailsMap.get(bet.sportId);
      
      console.log(`For bet with eventId ${bet.eventId}, found eventName: ${eventName}, sportName: ${sportName}`); // Debug log
      
      return {
        ...bet,
        eventName: eventName || null,
        sportName: sportName || null
      };
    });
  }

  // New method to get unique eventId and sportId combinations for a user
  async findUniqueEventAndSportIdsByUserId(userId: string): Promise<{ eventId: string; sportId: string }[]> {
    const bets = await this.sportBetsRepository.find({
      where: {
        user: { id: userId }
      },
      select: ['eventId', 'sportId'],
      order: {
        createdAt: 'DESC'
      }
    });

    // Create a Set to store unique combinations
    const uniqueCombinations = new Set<string>();
    const result: { eventId: string; sportId: string }[] = [];

    // Iterate through bets and add unique combinations
    for (const bet of bets) {
      const combination = `${bet.eventId}-${bet.sportId}`;
      if (!uniqueCombinations.has(combination)) {
        uniqueCombinations.add(combination);
        result.push({
          eventId: bet.eventId,
          sportId: bet.sportId
        });
      }
    }

    return result;
  }

  // New method to get unique eventId, sportId, and marketId combinations for a user
  async findUniqueEventSportAndMarketIdsByUserId(userId: string): Promise<{ eventId: string; sportId: string; marketId: string }[]> {
    const bets = await this.sportBetsRepository.find({
      where: {
        user: { id: userId }
      },
      select: ['eventId', 'sportId', 'marketId'],
      order: {
        createdAt: 'DESC'
      }
    });

    // Create a Set to store unique combinations
    const uniqueCombinations = new Set<string>();
    const result: { eventId: string; sportId: string; marketId: string }[] = [];

    // Iterate through bets and add unique combinations
    for (const bet of bets) {
      const combination = `${bet.eventId}-${bet.sportId}-${bet.marketId}`;
      if (!uniqueCombinations.has(combination)) {
        uniqueCombinations.add(combination);
        result.push({
          eventId: bet.eventId,
          sportId: bet.sportId,
          marketId: bet.marketId
        });
      }
    }

    return result;
  }

  findByUserIdAndEventId(userId: string, eventId: string): Promise<SportBets[]> {
    return this.sportBetsRepository.find({
      where: {
        user: { id: userId },
        eventId: eventId
      },
      relations: ['user', 'currency'], // Include necessary relations to ensure complete data
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

  // New method to fetch user bets and filter results by market
  async getUserBetsWithResults(sportsId: string, eventId: string, userId: string): Promise<any> {
    try {
      // Step 1: Fetch all bets for the user for the specific event
      const userBets = await this.sportBetsRepository.find({
        where: {
          user: { id: userId },
          eventId: eventId,
          sportId: sportsId
        },
        order: {
          createdAt: 'DESC'
        }
      });

      if (!userBets || userBets.length === 0) {
        return {
          success: true,
          message: 'No bets found for this user in this event',
          data: {
            bets: [],
            results: []
          }
        };
      }

      // Step 2: Extract unique market IDs from user bets
      const userMarketIds = [...new Set(userBets.map(bet => bet.marketId))];

      // Step 3: Call the result API
      const resultApiUrl = `${this.resultApiUrl}?event_id=${eventId}&sport_id=${sportsId}`;
      const resultResponse = await axios.get(resultApiUrl);
      const allResults: any[] = resultResponse.data;

      // Step 4: Filter results to only include markets where user has placed bets
      let filteredResults: any[] = [];
      if (allResults && Array.isArray(allResults)) {
        filteredResults = allResults.filter(result => 
          userMarketIds.includes(result.marketId)
        );
      }

      // Step 5: Return the data
      return {
        success: true,
        data: {
          bets: userBets,
          results: filteredResults
        }
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching user bets with results: ${error.message}`);
    }
  }

  // New method to process results and settle bets automatically
  async processResultAndSettleBets(eventId: string, sportsId: string, marketId: string): Promise<any> {
    try {
      // Fetch the match results from the third-party API
      const resultApiUrl = `${this.resultApiUrl}?event_id=${eventId}&sport_id=${sportsId}`;
      const resultResponse = await axios.get(resultApiUrl);
      const rawData: any = resultResponse.data;

      // Find the specific market in the results using marketId
      let targetMarket = null;
      let winningSelection = null;

      if (rawData && rawData.event && rawData.event.markets) {
        // Search through all market types and markets
        for (const marketType in rawData.event.markets) {
          if (Object.prototype.hasOwnProperty.call(rawData.event.markets, marketType)) {
            const markets = rawData.event.markets[marketType];
            if (Array.isArray(markets)) {
              for (const market of markets) {
                if (market.marketId === marketId) {
                  targetMarket = market;
                  
                  // Check if the market is settled
                  if (market.marketStatus && market.marketStatus.toLowerCase() !== 'open') {
                    // Find the winning selection in the runners
                    if (market.runners && Array.isArray(market.runners)) {
                      for (const runner of market.runners) {
                        if (runner.result && runner.result.toLowerCase() === 'won') {
                          winningSelection = runner.runnerName;
                          break;
                        }
                      }
                    }
                  }
                  break;
                }
              }
              if (targetMarket) break;
            }
          }
        }
      }

      if (!targetMarket) {
        throw new BadRequestException(`Market with ID ${marketId} not found in results`);
      }

      if (!winningSelection) {
        throw new BadRequestException(`Market ${marketId} is not settled or no winning selection found`);
      }

      // Now settle the market using the winning selection
      return await this.settleMarketResults(marketId, winningSelection);
    } catch (error) {
      if (error.response) {
        // Log the error response from the third-party API
        console.error('Third-party API error:', error.response.status, error.response.data);
      }
      throw new BadRequestException(`Error processing results and settling bets: ${error.message}`);
    }
  }

  // New method to settle market results
  async settleMarketResults(marketId: string, winningSelection: string): Promise<any> {
    try {
      // Start a database transaction to ensure atomicity
      const queryRunner = this.sportBetsRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Find all OPEN bets for the specified market
        const openBets = await queryRunner.manager.find(SportBets, {
          where: {
            marketId: marketId,
            status: BetStatus.PENDING // Only process open bets
          },
          relations: ['user']
        });

        if (!openBets || openBets.length === 0) {
          await queryRunner.rollbackTransaction();
          return {
            success: true,
            message: 'No open bets found for this market',
            processedBets: 0
          };
        }

        // Process each bet individually
        const results: any[] = [];
        for (const bet of openBets) {
          // Calculate profit/loss based on bet outcome
          let profitLoss = 0;
          let newStatus: BetStatus;

          // For BACK bets: if selection matches winning selection, bet wins; otherwise, bet loses
          if (bet.selection.toLowerCase() === winningSelection.toLowerCase()) {
            // Bet wins: Profit = (odds - 1) * stake
            profitLoss = (Number(bet.odds) - 1) * Number(bet.stake);
            newStatus = BetStatus.WON;
          } else {
            // Bet loses: Loss = -stake (negative profit)
            profitLoss = -Number(bet.stake);
            newStatus = BetStatus.LOST;
          }

          // Update user's balance with only the profit/loss (not including stake)
          const user = await queryRunner.manager.findOne(Users, { where: { id: bet.user.id } });
          if (!user) {
            throw new BadRequestException(`User ${bet.user.id} not found`);
          }

          // Update balance: add only the profit or loss (not the stake, since it wasn't deducted initially)
          const newBalance = user.balance + profitLoss;
          if (newBalance < 0) {
            throw new BadRequestException(`User ${bet.user.id} balance would go negative after settlement`);
          }

          // Update user balance
          await queryRunner.manager.update(Users, bet.user.id, { 
            balance: newBalance 
          });

          // Update bet status and mark as settled
          await queryRunner.manager.update(SportBets, bet.id, { 
            status: newStatus,
            updatedAt: new Date()
          });

          // Reduce user's exposure by the stake amount
          // Since this bet is now settled, it should no longer contribute to exposure
          const currentExposure = user.exposure;
          const newExposure = Math.max(0, currentExposure - Number(bet.stake));
          
          await queryRunner.manager.update(Users, bet.user.id, { 
            exposure: newExposure 
          });

          // Create result transaction record
          const resultTransaction = new ResultTransaction();
          resultTransaction.user = user; // Use the user object we already have
          // We need to find the market object for the relation, but for now we'll create a minimal transaction
          resultTransaction.description = `Bet settlement for market ${marketId}, selection: ${bet.selection}, status: ${newStatus}`;
          resultTransaction.pl = profitLoss; // p/l is the profit or loss which user had in that market
          resultTransaction.type = 'sportbet'; // specify the type
          resultTransaction.commissionStatus = CommissionStatus.ONE; // default as not mandatory
          
          // Save the result transaction
          await queryRunner.manager.save(ResultTransaction, resultTransaction);

          // Log the settlement for this bet
          results.push({
            betId: bet.id,
            userId: bet.user.id,
            originalStake: Number(bet.stake),
            odds: Number(bet.odds),
            selection: bet.selection,
            winningSelection: winningSelection,
            profitLoss: profitLoss,
            newStatus: newStatus,
            newBalance: newBalance,
            newExposure: newExposure
          });

          // Update exposure records for this market to remove settled bet's stake
          await this.updateExposureAfterSettlement(queryRunner, bet.user.id, bet.marketId, bet.eventId, Number(bet.stake));
        }

        // Commit the transaction
        await queryRunner.commitTransaction();

        return {
          success: true,
          message: `Successfully settled ${results.length} bets for market ${marketId}`,
          processedBets: results.length,
          results: results
        };

      } catch (error) {
        // Rollback transaction in case of error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      throw new BadRequestException(`Error settling market results: ${error.message}`);
    }
  }

  // Helper method to update exposure after settlement
  private async updateExposureAfterSettlement(
    queryRunner: any,
    userId: string,
    marketId: string,
    eventId: string,
    betStake: number
  ): Promise<void> {
    // According to requirements, do not modify the exposure table
    // Only update the user's exposure in the user table by deducting the bet stake
    
    const user = await queryRunner.manager.findOne(Users, { where: { id: userId } });
    if (user) {
      // Reduce the user's total exposure by the bet stake amount
      const newExposure = Math.max(0, user.exposure - betStake);
      
      await queryRunner.manager.update(Users, userId, { 
        exposure: newExposure 
      });
      
      // Emit socket event for frontend
      this.appGateway.emitExposureUpdate(userId, newExposure);
    }
  }

  // Helper method to recalculate and update user's total exposure
  private async updateUserTotalExposure(queryRunner: any, userId: string): Promise<void> {
    // Calculate total exposure across ALL active markets for this user
    const userExposures = await queryRunner.manager.find(Exposure, {
      where: {
        user: { id: userId },
        is_clear: 'false', // Only active exposures
      },
    });

    const totalExposure = userExposures.reduce((total, exp) => {
      return total + parseFloat(exp.exposure || '0');
    }, 0);

    // Update the user's total exposure in the users table
    await queryRunner.manager.update(Users, userId, { exposure: totalExposure });

    // Emit socket event for frontend
    this.appGateway.emitExposureUpdate(userId, totalExposure);
  }

  // New method to generate market report in ledger/tally style format based on result transactions only
  async generateMarketReport(userId: string, marketId?: string, eventId?: string): Promise<any[]> {
    // Get all result transactions for the user, optionally filtered by marketId and eventId
    const resultTransactions = await this.resultTransactionService.findAllByUserId(userId);
    
    // Filter result transactions based on optional marketId and eventId if provided
    let filteredTransactions = resultTransactions;
    if (marketId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.market && tx.market.marketId === marketId);
    }
    if (eventId) {
      // Since result transactions don't directly have eventId, we'll need to get related bets
      // to check if they match the eventId
      const betsForEvent = await this.sportBetsRepository.find({
        where: { user: { id: userId }, eventId: eventId },
        select: ['id']
      });
      const betIds = betsForEvent.map(bet => bet.id);
      
      filteredTransactions = filteredTransactions.filter(tx => {
        // This is a simplified approach - in a real scenario you'd need to link result transactions to bets
        // For now, we'll include all transactions since the direct relationship might not exist
        return true; 
      });
    }
    
    // Create ledger entries based on result transactions only
    const ledgerEntries: any[] = [];
    
    // Add result transactions (credits or debits based on P/L)
    for (const resultTx of filteredTransactions) {
      if (resultTx.user.id === userId) {
        let marketName = resultTx.market ? resultTx.market.marketId : 'N/A';
        if (resultTx.market && resultTx.market.marketName) {
          marketName = resultTx.market.marketName;
        }
        
        const pl = Number(resultTx.pl);
        ledgerEntries.push({
          resultDateTime: resultTx.createdAt,
          creditAmount: pl > 0 ? pl : 0,
          debitAmount: pl < 0 ? Math.abs(pl) : 0,
          description: resultTx.description,
          timestamp: resultTx.createdAt,
          type: 'result',
          resultTxId: resultTx.id
        });
      }
    }
    
    // Sort entries by timestamp with latest transaction first
    ledgerEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Calculate running balance starting with user's current balance
    // For now, we'll need to fetch the user's current balance
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Start with the user's current balance for the first (most recent) entry
    let runningBalance = user.balance;
    
    // Process entries from most recent to oldest
    for (const entry of ledgerEntries) {
      // The running balance for this entry is the current balance
      entry.runningBalance = runningBalance;
      
      // Then subtract the P/L to get the balance before this transaction
      const pl = entry.creditAmount - entry.debitAmount;
      runningBalance = runningBalance - pl; // Subtract the P/L to get previous balance
    }
    
    return ledgerEntries;
  }

  // New method to fetch match results directly from the API
  async getMatchResults(sportsId: string, eventId: string, marketId?: string, userId?: string): Promise<any> {
    try {
      // Call the result API with sports_id and event_id as parameters
      const resultApiUrl = `${this.resultApiUrl}?event_id=${eventId}&sport_id=${sportsId}`;
      
      const resultResponse = await axios.get(resultApiUrl);
      const rawData: any = resultResponse.data;
    
      // ALWAYS filter if marketId is provided
      if (marketId) {
        // Create empty markets object
        const filteredMarkets: any = {};
      
        // Only process if we have the expected structure
        if (rawData && rawData.event && rawData.event.markets) {
          const markets = rawData.event.markets;
        
          // Process each market type
          for (const marketType in markets) {
            if (Object.prototype.hasOwnProperty.call(markets, marketType)) {
              if (Array.isArray(markets[marketType])) {
                // Filter to only include markets matching our marketId
                const matches = markets[marketType].filter((market: any) => {
                  return market.marketId === marketId;
                });
            
                // Only include this market type if we found matches
                if (matches.length > 0) {
                  filteredMarkets[marketType] = matches;
                }
              }
            }
          }
        }
      
        // Check if the market is settled and trigger settlement if needed
        if (marketId && filteredMarkets) {
          // Look for settled markets in the filtered results
          for (const marketType in filteredMarkets) {
            if (Array.isArray(filteredMarkets[marketType])) {
              for (const market of filteredMarkets[marketType]) {
                if (market.marketId === marketId) {
                  // Check if market is settled (not open)
                  if (market.marketStatus && market.marketStatus.toLowerCase() !== 'open') {
                    // Find the winning selection
                    let winningSelection = null;
                    if (market.runners && Array.isArray(market.runners)) {
                      for (const runner of market.runners) {
                        if (runner.result && runner.result.toLowerCase() === 'won') {
                          winningSelection = runner.runnerName;
                          break;
                        }
                      }
                    }
                    
                    if (winningSelection) {
                      // Trigger settlement for this market
                      try {
                        await this.settleMarketResults(marketId, winningSelection);
                        console.log(`Market ${marketId} settled successfully with winning selection: ${winningSelection}`);
                      } catch (settlementError) {
                        console.error(`Error settling market ${marketId}:`, settlementError.message);
                        // Continue with returning results even if settlement fails
                      }
                    }
                  }
                }
              }
            }
          }
        }
      
        // Return response with filtered markets
        const response = {
          success: true,
          data: {
            ...rawData,
            event: {
              ...(rawData.event || {}),
              markets: filteredMarkets
            }
          }
        };
        
        // If userId is provided, fetch user's bets for this market and event
        if (userId) {
          const userBets = await this.sportBetsRepository.find({
            where: {
              user: { id: userId },
              eventId: eventId,
              marketId: marketId
            },
            order: {
              createdAt: 'DESC'
            }
          });
          
          response['userBets'] = userBets;
        }
        
        return response;
      }
    
      // No filtering needed
      return {
        success: true,
        data: rawData
      };
    } catch (error) {
      if (error.response) {
        // Log the error response from the third-party API
        console.error('Third-party API error:', error.response.status, error.response.data);
      }
      throw new BadRequestException(`Error fetching match results: ${error.message}`);
    }
  }
}