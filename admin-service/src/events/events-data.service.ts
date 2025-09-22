import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, catchError } from 'rxjs/operators';
import { throwError, lastValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { Events, EventStatus, ActualStatus } from './events.entity';
import { Sports, SportStatus } from '../sports/sports.entity';
import { Leagues } from '../leagues/leagues.entity';
import { Markets, MarketType, ExposureStatus } from '../markets/markets.entity';
import { Runners } from '../runners/runners.entity';
import { RedisService } from '../config/redis.service';

// Configuration for external API
class EventsDataConfig {
  static readonly EXTERNAL_API_BASE_URL = 'http://89.116.20.218:2700';
  static readonly EVENTS_ENDPOINT = '/events';
}

@Injectable()
export class EventsDataService {
  private readonly logger = new Logger(EventsDataService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
    @InjectRepository(Sports)
    private sportsRepository: Repository<Sports>,
    @InjectRepository(Leagues)
    private leaguesRepository: Repository<Leagues>,
    @InjectRepository(Markets)
    private marketsRepository: Repository<Markets>,
    @InjectRepository(Runners)
    private runnersRepository: Repository<Runners>,
    private readonly redisService: RedisService,
  ) {}

  async processEventsData(data: any): Promise<any> {
    try {
      this.logger.log('Processing events data:', JSON.stringify(data));

      // Validate required data
      if (!data) {
        throw new BadRequestException('No data provided');
      }

      if (!data.sport) {
        throw new BadRequestException('Sport data is required');
      }

      if (!data.competition) {
        throw new BadRequestException('Competition data is required');
      }

      if (!data.selectedEvents || !Array.isArray(data.selectedEvents)) {
        throw new BadRequestException('Selected events data is required');
      }

      // 1. Store sport data
      const sportData = await this.storeSportData(data.sport);

      // 2. Store league data
      const leagueData = await this.storeLeagueData(data.competition, data.sport.sportId);

      // 3. Get event data from Redis
      const eventData = await this.getEventDataFromRedis(data.selectedEvents[0]);

      // 4. Store event data
      const storedEvent = await this.storeEventData(eventData, leagueData.id);

      // 5. Store market data
      const marketData = await this.storeMarketData(eventData, storedEvent?.id || '');

      // 6. Store runner data
      if (marketData) {
        await this.storeRunnerData(eventData, marketData.id);
      }

      return {
        success: true,
        message: 'Data processed successfully',
        data: {
          sport: sportData,
          league: leagueData,
          event: storedEvent,
          market: marketData,
        },
      };
    } catch (error) {
      this.logger.error('Error processing events data:', error.stack);
      throw error;
    }
  }

  async getLiveCompetitions(sportId: string): Promise<any> {
    // Validate sportId parameter
    if (!sportId) {
      this.logger.error('Missing sport_id parameter');
      throw new BadRequestException('sport_id parameter is required');
    }

    const url = `${EventsDataConfig.EXTERNAL_API_BASE_URL}${EventsDataConfig.EVENTS_ENDPOINT}`;
    const params = {
      live_matches: 'true',
      sport_id: sportId,
    };

    this.logger.log(`Making HTTP request to ${url} with params:`, params);

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { params }).pipe(
          map((res: AxiosResponse) => {
            this.logger.log(`Received response from external API with status ${res.status}`);
            this.logger.log(`Response headers: ${JSON.stringify(res.headers)}`);
            this.logger.log(`Response data: ${JSON.stringify(res.data)}`);
            return res.data;
          }),
          catchError((error: AxiosError) => {
            this.logger.error(`Error calling external API: ${error.message}`, error.stack);
            // Log detailed error information
            if (error.response) {
              this.logger.error(`External API response status: ${error.response.status}`);
              this.logger.error(`External API response headers: ${JSON.stringify(error.response.headers)}`);
              this.logger.error(`External API response data: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
              this.logger.error(`No response received from external API: ${JSON.stringify(error.request)}`);
            }
            // Return a default response instead of throwing an error
            return throwError(() => new Error('Error fetching data from external API'));
          })
        )
      );

      // Transform the response to match the required structure
      const transformedResponse = this.transformLiveCompetitionsResponse(response, sportId);
      this.logger.log(`Transformed response:`, JSON.stringify(transformedResponse));
      return transformedResponse;
    } catch (error) {
      this.logger.error(`Error in getLiveCompetitions: ${error.message}`, error.stack);
      // Return a default response to prevent 500 errors
      return { sports: [] };
    }
  }

  private transformLiveCompetitionsResponse(data: any, sportId: string): any {
    this.logger.log(`Transforming live competitions response for sportId: ${sportId}`);
    this.logger.log(`Raw data received: ${JSON.stringify(data)}`);
    
    // Check if data exists
    if (!data) {
      this.logger.log(`No data found in response, returning empty array`);
      return { sports: [] };
    }
    
    // Handle different response formats
    if (data.sports && Array.isArray(data.sports)) {
      // Already in the expected format
      this.logger.log(`Data already in expected format with ${data.sports.length} sports`);
      return data;
    }
    
    // Check if it's a single sport object
    if (data.sportId || data.sport_name || data.competitions) {
      this.logger.log(`Data is a single sport object`);
      return { sports: [data] };
    }
    
    // Check if it's directly competitions data
    if (data.competitions && Array.isArray(data.competitions)) {
      this.logger.log(`Data contains competitions array directly`);
      return {
        sports: [{
          sportId: sportId,
          sport_name: 'Unknown Sport',
          competitions: data.competitions
        }]
      };
    }
    
    // Check if it's events data directly
    if (data.events && Array.isArray(data.events)) {
      this.logger.log(`Data contains events array directly`);
      return {
        sports: [{
          sportId: sportId,
          sport_name: 'Unknown Sport',
          competitions: [{
            competitionId: 'unknown',
            competition_name: 'Unknown Competition',
            events: data.events
          }]
        }]
      };
    }
    
    // If we can't recognize the format, return empty
    this.logger.log(`Unrecognized data format, returning empty array`);
    return { sports: [] };
  }

  private async storeSportData(sport: any): Promise<Sports> {
    try {
      // Validate sport data
      if (!sport || !sport.sportName || !sport.sportId) {
        throw new BadRequestException('Invalid sport data: sportName and sportId are required');
      }

      // Check if sport already exists
      let existingSport = await this.sportsRepository.findOne({
        where: { name: sport.sportName }
      });

      if (!existingSport) {
        // Create new sport
        const sportEntity = this.sportsRepository.create({
          name: sport.sportName,
          slugName: sport.sportName.toLowerCase().replace(/\s+/g, '-'),
          sportsCode: sport.sportId,
          status: SportStatus.ONE,
          actualStatus: SportStatus.ONE,
        });
        existingSport = await this.sportsRepository.save(sportEntity);
        this.logger.log(`Created new sport: ${sport.sportName}`);
      } else {
        this.logger.log(`Sport already exists: ${sport.sportName}`);
      }

      return existingSport;
    } catch (error) {
      this.logger.error('Error storing sport data:', error.stack);
      throw error;
    }
  }

  private async storeLeagueData(competition: any, sportId: string): Promise<Leagues> {
    try {
      // Validate competition data
      if (!competition || !competition.competitionId || !competition.competitionName) {
        throw new BadRequestException('Invalid competition data: competitionId and competitionName are required');
      }

      // Check if league already exists
      let existingLeague = await this.leaguesRepository.findOne({
        where: { leagueId: competition.competitionId }
      });

      if (!existingLeague) {
        // Create new league
        const leagueEntity = this.leaguesRepository.create({
          leagueId: competition.competitionId,
          name: competition.competitionName,
          sportId: sportId,
        });
        existingLeague = await this.leaguesRepository.save(leagueEntity);
        this.logger.log(`Created new league: ${competition.competitionName}`);
      } else {
        // Update existing league if sportId is different
        if (existingLeague.sportId !== sportId) {
          existingLeague.sportId = sportId;
          existingLeague = await this.leaguesRepository.save(existingLeague);
          this.logger.log(`Updated league with new sportId: ${competition.competitionName}`);
        } else {
          this.logger.log(`League already exists: ${competition.competitionName}`);
        }
      }

      return existingLeague;
    } catch (error) {
      this.logger.error('Error storing league data:', error.stack);
      throw error;
    }
  }

  private async getEventDataFromRedis(eventId: string): Promise<any> {
    try {
      if (!eventId) {
        this.logger.warn('No eventId provided for Redis lookup');
        return null;
      }

      // Extract sportId from eventId (format: vbi:match:49584488)
      // We'll try to get the sportId from the event ID structure
      const parts = eventId.split(':');
      if (parts.length < 3) {
        this.logger.warn(`Invalid eventId format: ${eventId}`);
        return null;
      }

      // Use the third part as sport identifier
      const sportId = parts[2];
      const redisKey = `sports_data:${sportId}`;
      const jsonData = await this.redisService.getClient().get(redisKey);
      
      if (jsonData) {
        const redisData = JSON.parse(jsonData);
        // Find the event in the Redis data
        if (redisData.sports && Array.isArray(redisData.sports)) {
          for (const sport of redisData.sports) {
            if (sport.eventId === eventId) {
              return sport;
            }
          }
        }
      }
      
      this.logger.warn(`No event data found in Redis for eventId: ${eventId}`);
      return null;
    } catch (error) {
      this.logger.error('Error getting event data from Redis:', error.stack);
      throw error;
    }
  }

  private async storeEventData(eventData: any, leagueId: string): Promise<Events | null> {
    try {
      if (!eventData) {
        this.logger.warn('No event data provided, skipping event storage');
        return null;
      }

      // Validate event data
      if (!eventData.eventId || !eventData.eventName) {
        this.logger.warn('Invalid event data: eventId and eventName are required');
        return null;
      }

      // Check if event already exists
      let existingEvent = await this.eventsRepository.findOne({
        where: { eventId: eventData.eventId }
      });

      // Map the status from the API response to our enum
      let actualStatus: ActualStatus = ActualStatus.UPCOMING;
      if (eventData.status) {
        const statusStr = eventData.status.toLowerCase().replace(' ', '_');
        if (statusStr === 'in_play') {
          actualStatus = ActualStatus.IN_PLAY;
        } else if (statusStr === 'finished') {
          actualStatus = ActualStatus.FINISHED;
        } else if (statusStr === 'cancelled') {
          actualStatus = ActualStatus.CANCELLED;
        }
      }

      if (!existingEvent) {
        // Create new event
        const eventEntity = this.eventsRepository.create({
          eventId: eventData.eventId,
          league: { id: leagueId } as Leagues,
          date: new Date(eventData.openDate || eventData.eventDate || Date.now()),
          status: EventStatus.ONE,
          actualStatus: actualStatus,
          name: eventData.eventName || eventData.event_name,
        });
        existingEvent = await this.eventsRepository.save(eventEntity);
        this.logger.log(`Created new event: ${eventData.eventId}`);
      } else {
        // Update existing event
        existingEvent.league = { id: leagueId } as Leagues;
        existingEvent.date = new Date(eventData.openDate || eventData.eventDate || existingEvent.date);
        existingEvent.actualStatus = actualStatus;
        existingEvent.name = eventData.eventName || eventData.event_name || existingEvent.name;
        existingEvent = await this.eventsRepository.save(existingEvent);
        this.logger.log(`Updated event: ${eventData.eventId}`);
      }

      return existingEvent;
    } catch (error) {
      this.logger.error('Error storing event data:', error.stack);
      throw error;
    }
  }

  private async storeMarketData(eventData: any, eventId: string): Promise<Markets | null> {
    try {
      if (!eventData || !eventData.markets) {
        this.logger.warn('No market data found in event data');
        return null;
      }

      // For now, let's assume we're working with the first market
      const marketInfo = eventData.markets[0];
      
      if (!marketInfo) {
        this.logger.warn('No market info found in event data');
        return null;
      }

      // Validate market data
      if (!marketInfo.marketId || !marketInfo.marketName) {
        this.logger.warn('Invalid market data: marketId and marketName are required');
        return null;
      }

      // Check if market already exists
      let existingMarket = await this.marketsRepository.findOne({
        where: { marketId: marketInfo.marketId }
      });

      if (!existingMarket) {
        // Create new market
        const marketEntity = this.marketsRepository.create({
          marketId: marketInfo.marketId,
          marketName: marketInfo.marketName,
          marketType: MarketType.ODDS,
          marketTime: new Date(),
          status: ExposureStatus.ONE,
        });
        existingMarket = await this.marketsRepository.save(marketEntity);
        this.logger.log(`Created new market: ${marketInfo.marketName}`);
      } else {
        this.logger.log(`Market already exists: ${marketInfo.marketName}`);
      }

      // Associate market with event if eventId is provided
      if (eventId) {
        await this.associateMarketWithEvent(existingMarket.id, eventId);
      }

      return existingMarket;
    } catch (error) {
      this.logger.error('Error storing market data:', error.stack);
      throw error;
    }
  }

  private async storeRunnerData(eventData: any, marketId: string): Promise<void> {
    try {
      if (!eventData || !eventData.markets) {
        this.logger.warn('No market data found in event data for runners');
        return;
      }

      // For now, let's assume we're working with the first market
      const marketInfo = eventData.markets[0];
      
      if (!marketInfo || !marketInfo.runners) {
        this.logger.warn('No runner data found in market data');
        return;
      }

      for (const runnerInfo of marketInfo.runners) {
        // Validate runner data
        if (!runnerInfo.runnerId) {
          this.logger.warn('Invalid runner data: runnerId is required');
          continue;
        }

        // Check if runner already exists
        let existingRunner = await this.runnersRepository.findOne({
          where: { runnerId: runnerInfo.runnerId }
        });

        if (!existingRunner) {
          // Create new runner
          const runnerEntity = this.runnersRepository.create({
            runnerId: runnerInfo.runnerId,
            name: runnerInfo.runnerName || runnerInfo.name || 'Unknown Runner',
          });
          existingRunner = await this.runnersRepository.save(runnerEntity);
          this.logger.log(`Created new runner: ${runnerInfo.runnerName || runnerInfo.name || runnerInfo.runnerId}`);
        } else {
          this.logger.log(`Runner already exists: ${runnerInfo.runnerName || runnerInfo.name || runnerInfo.runnerId}`);
        }

        // Associate runner with market if marketId is provided
        if (marketId) {
          await this.associateRunnerWithMarket(existingRunner.id, marketId);
        }
      }
    } catch (error) {
      this.logger.error('Error storing runner data:', error.stack);
      throw error;
    }
  }

  private async associateMarketWithEvent(marketId: string, eventId: string): Promise<void> {
    try {
      // Get the event with its markets
      const event = await this.eventsRepository.findOne({
        where: { id: eventId },
        relations: ['markets'],
      });

      if (event) {
        // Check if market is already associated
        const isAssociated = event.markets && event.markets.some(m => m.id === marketId);
        
        if (!isAssociated) {
          // Associate market with event
          await this.eventsRepository
            .createQueryBuilder()
            .relation(Events, 'markets')
            .of(eventId)
            .add(marketId);
          this.logger.log(`Associated market ${marketId} with event ${eventId}`);
        }
      }
    } catch (error) {
      this.logger.error('Error associating market with event:', error.stack);
      throw error;
    }
  }

  private async associateRunnerWithMarket(runnerId: string, marketId: string): Promise<void> {
    try {
      // Get the market with its runners
      const market = await this.marketsRepository.findOne({
        where: { id: marketId },
        relations: ['runners'],
      });

      if (market) {
        // Check if runner is already associated
        const isAssociated = market.runners && market.runners.some(r => r.id === runnerId);
        
        if (!isAssociated) {
          // Associate runner with market
          await this.marketsRepository
            .createQueryBuilder()
            .relation(Markets, 'runners')
            .of(marketId)
            .add(runnerId);
          this.logger.log(`Associated runner ${runnerId} with market ${marketId}`);
        }
      }
    } catch (error) {
      this.logger.error('Error associating runner with market:', error.stack);
      throw error;
    }
  }
}