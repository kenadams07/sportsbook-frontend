import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, catchError } from 'rxjs/operators';
import { throwError, lastValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { Events, EventStatus, ActualStatus } from './events.entity';
import { EventsConfig } from './events.constants';
import { RedisService } from '../config/redis.service';
import { Runners } from '../runners/runners.entity';
import { Markets, MarketType, ExposureStatus } from '../markets/markets.entity';
import { Leagues } from '../leagues/leagues.entity';
import { Sports, SportStatus } from '../sports/sports.entity';

// Configuration for external API
class EventsDataConfig {
  static readonly EXTERNAL_API_BASE_URL = 'http://89.116.20.218:2700';
  static readonly EVENTS_ENDPOINT = '/events';
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
    @InjectRepository(Runners)
    private runnersRepository: Repository<Runners>,
    @InjectRepository(Markets)
    private marketsRepository: Repository<Markets>,
    @InjectRepository(Leagues)
    private leaguesRepository: Repository<Leagues>,
    @InjectRepository(Sports)
    private sportsRepository: Repository<Sports>,
    private readonly redisService: RedisService,
  ) {
    this.logger.log('EventsService initialized');
    // Check if Redis service is available
    try {
      const redisClient = this.redisService.getClient();
      this.logger.log('Redis client is available in EventsService');
    } catch (error) {
      this.logger.error('Redis client is not available in EventsService', error.message);
    }
  }

  async testRedisConnection(): Promise<boolean> {
    try {
      const redisClient = this.redisService.getClient();
      const result = await redisClient.ping();
      this.logger.log(`Redis connection test successful: ${result}`);
      return true;
    } catch (error) {
      this.logger.error(`Redis connection test failed: ${error.message}`);
      return false;
    }
  }

  async debugRedis(): Promise<any> {
    try {
      this.logger.log('Debugging Redis connection');
      const redisClient = this.redisService.getClient();
      this.logger.log('Redis client obtained successfully');
      
      // Try to ping Redis
      const pingResult = await redisClient.ping();
      this.logger.log(`Redis ping result: ${pingResult}`);
      
      // Try to set a test key
      const setResult = await redisClient.set('test_key', 'test_value', 'EX', 10);
      this.logger.log(`Redis set result: ${setResult}`);
      
      // Try to get the test key
      const getResult = await redisClient.get('test_key');
      this.logger.log(`Redis get result: ${getResult}`);
      
      return {
        connected: true,
        ping: pingResult,
        set: setResult,
        get: getResult
      };
    } catch (error) {
      this.logger.error(`Redis debug failed: ${error.message}`, error.stack);
      return {
        connected: false,
        error: error.message
      };
    }
  }

  async getLiveEvents(sportId: string): Promise<any> {
    // Validate sportId parameter
    if (!sportId) {
      this.logger.error('Missing sport_id parameter');
      throw new BadRequestException('sport_id parameter is required');
    }

    const url = `${EventsConfig.EXTERNAL_API_BASE_URL}${EventsConfig.EVENTS_ENDPOINT}`;
    const params = {
      live_matches: 'true',
      sport_id: sportId,
    };

    this.logger.log(`Making HTTP request to ${url} with params:`, params);

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { params }).pipe(
          map((res: AxiosResponse) => {
            this.logger.log(`Received response from external API:`, JSON.stringify(res.data));
            return res.data;
          }),
          catchError((error: AxiosError) => {
            this.logger.error(`Error calling external API: ${error.message}`, error.stack);
            // Log detailed error information
            if (error.response) {
              this.logger.error(`External API response status: ${error.response.status}`);
              this.logger.error(`External API response data: ${JSON.stringify(error.response.data)}`);
            }
            return throwError(() => error);
          })
        )
      );

      // Log the response data before storing in Redis
      this.logger.log(`External API response received. Data type: ${typeof response}, Data keys: ${response ? Object.keys(response) : 'null'}`);
      if (response && response.sports) {
        this.logger.log(`Number of sports in response: ${response.sports.length}`);
      }

      // Store the complete response object in Redis (will replace previous object)
      try {
        await this.storeCompleteResponseInRedis(sportId, response);
      } catch (storeError) {
        this.logger.error(`Failed to store response in Redis for sportId: ${sportId}`, storeError.stack);
      }

      // Transform the response to match the required structure
      const transformedResponse = this.transformResponse(response, sportId);
      this.logger.log(`Transformed response:`, JSON.stringify(transformedResponse));
      return transformedResponse;
    } catch (error) {
      this.logger.error(`Error in getLiveEvents: ${error.message}`, error.stack);
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

      // Store the complete response object in Redis (will replace previous object)
      await this.storeCompleteResponseInRedis(sportId, response);

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

  private async fetchDataFromThirdPartyAPI(sportId: string): Promise<any> {
    // Validate sportId parameter
    if (!sportId) {
      this.logger.error('Missing sport_id parameter');
      throw new BadRequestException('sport_id parameter is required');
    }

    const url = `${EventsConfig.EXTERNAL_API_BASE_URL}${EventsConfig.EVENTS_ENDPOINT}`;
    const params = {
      live_matches: 'true',
      sport_id: sportId,
    };

    this.logger.log(`Making direct HTTP request to ${url} with params:`, params);

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { params }).pipe(
          map((res: AxiosResponse) => {
            this.logger.log(`Received direct response from external API with status ${res.status}`);
            return res.data;
          }),
          catchError((error: AxiosError) => {
            this.logger.error(`Error calling external API directly: ${error.message}`, error.stack);
            // Log detailed error information
            if (error.response) {
              this.logger.error(`External API response status: ${error.response.status}`);
              this.logger.error(`External API response data: ${JSON.stringify(error.response.data)}`);
            }
            return throwError(() => error);
          })
        )
      );

      return response;
    } catch (error) {
      this.logger.error(`Error in fetchDataFromThirdPartyAPI: ${error.message}`, error.stack);
      throw error;
    }
  }

  async processEventsData(payload: any): Promise<any> {
    try {
      this.logger.log(`Processing events data with payload:`, JSON.stringify(payload));
      
      // Extract data from payload
      const { selectedEvents, competition, sport } = payload;
      
      if (!selectedEvents || !Array.isArray(selectedEvents)) {
        throw new BadRequestException('selectedEvents is required and must be an array');
      }
      
      if (!competition || !competition.competitionId) {
        throw new BadRequestException('competition with competitionId is required');
      }
      
      if (!sport || !sport.sportId) {
        throw new BadRequestException('sport with sportId is required');
      }
      
      // Fetch data from Redis
      let redisData = await this.getStoredResponseFromRedis(sport.sportId);
      
      // Backup mechanism: If no data found in Redis, call the third-party API directly
      if (!redisData || !redisData.sports) {
        this.logger.warn(`No data found in Redis for sport ${sport.sportId}, attempting to fetch data directly from third-party API`);
        try {
          // Call the third-party API directly to get fresh data without storing in Redis
          const freshData = await this.fetchDataFromThirdPartyAPI(sport.sportId);
          redisData = freshData;
          this.logger.log(`Successfully fetched fresh data directly from third-party API for sport ${sport.sportId}`);
        } catch (fetchError) {
          this.logger.error(`Failed to fetch fresh data from third-party API for sport ${sport.sportId}: ${fetchError.message}`);
          throw new InternalServerErrorException(`Failed to fetch data for sport ${sport.sportId}`);
        }
      }
      
      if (!redisData || !redisData.sports) {
        this.logger.error(`No data available for sport ${sport.sportId} even after attempting to fetch fresh data`);
        throw new InternalServerErrorException(`No data available for sport ${sport.sportId}`);
      }
      
      this.logger.log(`Retrieved data from cache/API for sport ${sport.sportId}`);
      
      // Filter sports data to match the competition ID
      const filteredSports = redisData.sports.filter(sportData => 
        sportData.competitionId === competition.competitionId
      );
      
      if (filteredSports.length === 0) {
        this.logger.warn(`No sports data found for competition ${competition.competitionId}`);
        throw new InternalServerErrorException(`No sports data found for competition ${competition.competitionId}`);
      }
      
      this.logger.log(`Found ${filteredSports.length} sports for competition ${competition.competitionId}`);
      
      // Process each selected event
      const processedEvents: Array<{event: Events, markets: Markets[], runners: Runners[], league: Leagues}> = [];
      
      for (const eventId of selectedEvents) {
        // Find matching event in filtered sports data
        const matchingEvent = filteredSports.find(sportData => sportData.eventId === eventId);
        
        if (!matchingEvent) {
          this.logger.warn(`No matching event found for eventId: ${eventId}`);
          continue;
        }
        
        this.logger.log(`Processing event: ${eventId}`);
        
        // 1. Store runners first
        const runners = await this.storeRunners(matchingEvent.markets?.matchOdds || []);
        this.logger.log(`Stored ${runners.length} runners for event ${eventId}`);
        
        // 2. Store markets with runner IDs
        const markets = await this.storeMarkets(matchingEvent.markets?.matchOdds || [], runners);
        this.logger.log(`Stored ${markets.length} markets for event ${eventId}`);
        
        // 3. Store event with market IDs
        const event = await this.storeEvent(matchingEvent, markets);
        this.logger.log(`Stored event: ${event.id}`);
        
        // 4. Store competition (league) with event ID
        const league = await this.storeLeague(competition, event);
        this.logger.log(`Stored league: ${league.id}`);
        
        processedEvents.push({
          event,
          markets,
          runners,
          league
        });
      }
      
      return {
        success: true,
        message: `Processed ${processedEvents.length} events`,
        data: processedEvents
      };
    } catch (error) {
      this.logger.error(`Error processing events data: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getStoredResponseFromRedis(sportId: string): Promise<any> {
    try {
      this.logger.log(`Attempting to retrieve data from Redis for sportId: ${sportId}`);
      
      // Check if Redis client is available
      const redisClient = this.redisService.getClient();
      if (!redisClient) {
        this.logger.error(`Redis client is not available for retrieving data for sportId: ${sportId}`);
        return null;
      }
      
      const redisKey = `sports_data:${sportId}`;
      this.logger.log(`Redis key to be used for retrieval: ${redisKey}`);
      
      const jsonData = await redisClient.get(redisKey);
      if (jsonData) {
        this.logger.log(`Found data in Redis for sportId: ${sportId}`);
        const parsedData = JSON.parse(jsonData);
        this.logger.log(`Parsed data type: ${typeof parsedData}, Data keys: ${parsedData ? Object.keys(parsedData) : 'null'}`);
        return parsedData;
      } else {
        this.logger.log(`No data found in Redis for sportId: ${sportId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to retrieve response from Redis for sportId: ${sportId}`, error.message);
      this.logger.error(`Error stack: ${error.stack}`);
      // Also log the type of error and any additional properties
      this.logger.error(`Error type: ${error.constructor.name}`);
      if (error.code) this.logger.error(`Error code: ${error.code}`);
      if (error.errno) this.logger.error(`Error errno: ${error.errno}`);
      if (error.syscall) this.logger.error(`Error syscall: ${error.syscall}`);
      return null;
    }
  }

  async findAll(): Promise<Events[]> {
    return this.eventsRepository.find();
  }

  async findOne(id: string): Promise<Events | null> {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async create(eventsData: Partial<Events>): Promise<Events> {
    const events = this.eventsRepository.create(eventsData);
    return this.eventsRepository.save(events);
  }

  async update(id: string, eventsData: Partial<Events>): Promise<Events | null> {
    await this.eventsRepository.update(id, eventsData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
  }

  private async storeCompleteResponseInRedis(sportId: string, response: any): Promise<void> {
    try {
      this.logger.log(`Attempting to store data in Redis for sportId: ${sportId}`);
      
      // Check if Redis client is available
      const redisClient = this.redisService.getClient();
      if (!redisClient) {
        this.logger.error(`Redis client is not available for sportId: ${sportId}`);
        return;
      }
      
      const redisKey = `sports_data:${sportId}`;
      this.logger.log(`Redis key to be used: ${redisKey}`);
      
      // Log the size of data being stored
      const jsonData = JSON.stringify(response);
      this.logger.log(`Data size to be stored: ${jsonData.length} characters`);
      
      // Store with a TTL of 5 minutes (300 seconds) - adjust as needed
      this.logger.log(`Setting data in Redis with TTL of 300 seconds`);
      const result = await redisClient.set(redisKey, jsonData);
      console.log(result);
      
      this.logger.log(`Stored complete response in Redis for sportId: ${sportId} with 5-minute TTL. Redis response: ${result}`);
    } catch (error) {
      this.logger.error(`Failed to store response in Redis for sportId: ${sportId}`, error.message);
      this.logger.error(`Error stack: ${error.stack}`);
      // Also log the type of error and any additional properties
      this.logger.error(`Error type: ${error.constructor.name}`);
      if (error.code) this.logger.error(`Error code: ${error.code}`);
      if (error.errno) this.logger.error(`Error errno: ${error.errno}`);
      if (error.syscall) this.logger.error(`Error syscall: ${error.syscall}`);
    }
  }

  private transformLiveCompetitionsResponse(data: any, sportId: string): any {
    this.logger.log(`Transforming live competitions response for sportId: ${sportId}`);
    this.logger.log(`Raw data received: ${JSON.stringify(data)}`);
    
    // Check if data exists and has sports array
    if (!data) {
      this.logger.log(`No data found in response, returning empty array`);
      return { sports: [] };
    }
    
    if (!data.sports || !Array.isArray(data.sports)) {
      this.logger.log(`No sports data found in response, returning empty array`);
      return { sports: [] };
    }

    // Use the sports array directly from the response
    // Only send the required data to the frontend
    const sports = data.sports.map((sport: any) => ({
      competitionId: sport.competitionId || sport.competition_id || '',
      competitionName: sport.competition_name || sport.competitionName || '',
      eventId: sport.eventId || sport.event_id || '',
      eventName: sport.eventName || sport.event_name || '',
      marketName: sport.markets?.matchOdds?.[0]?.marketName || '', // Add marketName from first match odd
      openDate: sport.openDate || sport.open_date || '' // Add openDate
    }));

    this.logger.log(`Transformed ${sports.length} sports`);
    return { sports };
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

  private async storeLeagueWithEvent(competition: any, event: Events): Promise<Leagues> {
    try {
      // Check if league already exists
      let league = await this.leaguesRepository.findOne({
        where: { leagueId: competition.competitionId }
      });
      
      if (!league) {
        // Create new league
        const newLeague = this.leaguesRepository.create({
          leagueId: competition.competitionId,
          name: competition.competitionName
        });
        league = await this.leaguesRepository.save(newLeague);
      }
      
      // Associate event with league
      if (event) {
        // Get the existing events for this league
        const existingLeague = await this.leaguesRepository.findOne({
          where: { id: league.id },
          relations: ['events']
        });
        
        if (existingLeague) {
          // Add the new event to the existing events
          if (!existingLeague.events) {
            existingLeague.events = [];
          }
          
          // Check if event is already associated
          const isEventAssociated = existingLeague.events.some(e => e.id === event.id);
          
          if (!isEventAssociated) {
            existingLeague.events.push(event);
            await this.leaguesRepository.save(existingLeague);
          }
        }
      }
      
      return league;
    } catch (error) {
      this.logger.error(`Failed to store league: ${error.message}`);
      throw new InternalServerErrorException('Failed to store league');
    }
  }

  private async getCompleteSportsDataFromRedis(sportId: string): Promise<any> {
    try {
      const redisKey = `sports_data:${sportId}`;
      const jsonData = await this.redisService.getClient().get(redisKey);
      if (jsonData) {
        return JSON.parse(jsonData);
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to retrieve response from Redis for sportId: ${sportId}`, error.message);
      return null;
    }
  }

  private async storeRunners(matchOdds: any[]): Promise<Runners[]> {
    const runners: Runners[] = [];
    
    try {
      for (const market of matchOdds) {
        if (market.runners && Array.isArray(market.runners)) {
          for (const runnerData of market.runners) {
            // Check if runner already exists
            let runner = await this.runnersRepository.findOne({
              where: { selectionId: runnerData.runnerId }
            });
            
            if (!runner) {
              // Create new runner
              const newRunner = this.runnersRepository.create({
                selectionId: runnerData.runnerId,
                name: runnerData.runnerName
              });
              runner = await this.runnersRepository.save(newRunner);
            }
            
            if (runner) {
              runners.push(runner);
            }
          }
        }
      }
      
      return runners;
    } catch (error) {
      this.logger.error(`Failed to store runners: ${error.message}`);
      throw new InternalServerErrorException('Failed to store runners');
    }
  }

  private async storeMarkets(matchOdds: any[], runners: Runners[]): Promise<Markets[]> {
    const markets: Markets[] = [];
    
    try {
      for (const marketData of matchOdds) {
        // Check if market already exists
        let market = await this.marketsRepository.findOne({
          where: { marketId: marketData.marketId }
        });
        
        if (!market) {
          // Create new market
          const newMarket = this.marketsRepository.create({
            marketId: marketData.marketId,
            marketName: marketData.marketName,
            marketType: MarketType.ODDS, // Use the correct enum
            marketTime: new Date(marketData.marketTime),
            status: ExposureStatus.ONE // Use the correct enum
          });
          market = await this.marketsRepository.save(newMarket);
        }
        
        // Associate runners with market (if needed)
        // This would typically be handled through the many-to-many relationship
        
        if (market) {
          markets.push(market);
        }
      }
      
      return markets;
    } catch (error) {
      this.logger.error(`Failed to store markets: ${error.message}`);
      throw new InternalServerErrorException('Failed to store markets');
    }
  }

  private async storeEvent(eventData: any, markets: Markets[]): Promise<Events> {
    try {
      // Check if event already exists
      let event = await this.eventsRepository.findOne({
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
      
      if (!event) {
        // Create new event
        const newEvent = this.eventsRepository.create({
          eventId: eventData.eventId,
          date: new Date(eventData.openDate),
          status: EventStatus.ONE, // Default status
          actualStatus: actualStatus,
          name: eventData.eventName
        });
        event = await this.eventsRepository.save(newEvent);
      } else {
        // Update existing event
        event.date = new Date(eventData.openDate);
        event.actualStatus = actualStatus;
        event.name = eventData.eventName;
        event = await this.eventsRepository.save(event);
      }
      
      // Associate markets with event
      if (markets.length > 0) {
        event.markets = markets;
        await this.eventsRepository.save(event);
      }
      
      return event;
    } catch (error) {
      this.logger.error(`Failed to store event: ${error.message}`);
      throw new InternalServerErrorException('Failed to store event');
    }
  }

  private async storeLeague(competition: any, event: Events): Promise<Leagues> {
    try {
      // Check if league already exists
      let league = await this.leaguesRepository.findOne({
        where: { leagueId: competition.competitionId }
      });
      
      if (!league) {
        // Create new league
        const newLeague = this.leaguesRepository.create({
          leagueId: competition.competitionId,
          name: competition.competitionName
        });
        league = await this.leaguesRepository.save(newLeague);
      }
      
      // Associate event with league if it's not already associated
      if (event) {
        // First, get the league with its existing events
        const leagueWithEvents = await this.leaguesRepository.findOne({
          where: { id: league.id },
          relations: ['events']
        });
        
        if (leagueWithEvents) {
          // Check if the event is already associated with this league
          const isEventAssociated = leagueWithEvents.events && 
            leagueWithEvents.events.some(e => e.id === event.id);
          
          if (!isEventAssociated) {
            // Add the new event to the existing events array
            if (!leagueWithEvents.events) {
              leagueWithEvents.events = [];
            }
            leagueWithEvents.events.push(event);
            await this.leaguesRepository.save(leagueWithEvents);
          }
        }
      }
      
      return league;
    } catch (error) {
      this.logger.error(`Failed to store league: ${error.message}`);
      // Re-throw the error to maintain the original behavior
      throw error;
    }
  }

  private async storeEventsInDatabase(response: any): Promise<void> {
    try {
      if (response && response.sports && Array.isArray(response.sports)) {
        for (const sport of response.sports) {
          // Check if event already exists
          const existingEvent = await this.eventsRepository.findOne({ 
            where: { eventId: sport.eventId } 
          });
          
          // Map the status from the API response to our enum
          let actualStatus: ActualStatus = ActualStatus.UPCOMING;
          if (sport.status) {
            const statusStr = sport.status.toLowerCase().replace(' ', '_');
            if (statusStr === 'in_play') {
              actualStatus = ActualStatus.IN_PLAY;
            } else if (statusStr === 'finished') {
              actualStatus = ActualStatus.FINISHED;
            } else if (statusStr === 'cancelled') {
              actualStatus = ActualStatus.CANCELLED;
            }
          }
          
          if (!existingEvent) {
            // Create new event record
            const eventData: Partial<Events> = {
              eventId: sport.eventId,
              date: new Date(sport.openDate),
              status: EventStatus.ONE, // Default status
              actualStatus: actualStatus,
              name: sport.eventName,
            };
            
            await this.create(eventData);
            this.logger.log(`Stored event in database: ${sport.eventId}`);
          } else {
            // Update existing event
            const eventData: Partial<Events> = {
              date: new Date(sport.openDate),
              actualStatus: actualStatus,
              name: sport.eventName,
            };
            
            await this.update(existingEvent.id, eventData);
            this.logger.log(`Updated event in database: ${sport.eventId}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to store events in database:`, error.message);
    }
  }

  private transformResponse(data: any, sportId: string): any {
    this.logger.log(`Transforming response for sportId: ${sportId}`);
    
    // Check if data exists and has sports array
    if (!data) {
      this.logger.log(`No data found in response, returning empty array`);
      return { sports: [] };
    }
    
    if (!data.sports || !Array.isArray(data.sports)) {
      this.logger.log(`No sports data found in response, returning empty array`);
      return { sports: [] };
    }

    // Use the sports array directly from the response
    // Only send the required data to the frontend
    const sports = data.sports.map((sport: any) => ({
      competitionId: sport.competitionId || sport.competition_id || '',
      competitionName: sport.competition_name || sport.competitionName || '',
      eventId: sport.eventId || sport.event_id || '',
      eventName: sport.eventName || sport.event_name || '',
      marketName: sport.markets?.matchOdds?.[0]?.marketName || '', // Add marketName from first match odd
      openDate: sport.openDate || sport.open_date || '' // Add openDate
    }));

    this.logger.log(`Transformed ${sports.length} sports`);
    return { sports };
  }
}