import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, catchError } from 'rxjs/operators';
import { throwError, lastValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { Events, EventStatus, ActualStatus } from './events.entity';
import { EventsConfig } from './events.constants';
import { RedisService } from '../config/redis.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
    private readonly redisService: RedisService,
  ) {}

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

      // Store the complete response object in Redis (will replace previous object)
      await this.storeCompleteResponseInRedis(sportId, response);

      // Transform the response to match the required structure
      const transformedResponse = this.transformResponse(response, sportId);
      this.logger.log(`Transformed response:`, JSON.stringify(transformedResponse));
      return transformedResponse;
    } catch (error) {
      this.logger.error(`Error in getLiveEvents: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getStoredResponseFromRedis(sportId: string): Promise<any> {
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
      const redisKey = `sports_data:${sportId}`;
      const jsonData = JSON.stringify(response);
      // Store with a TTL of 5 minutes (300 seconds) - adjust as needed
      await this.redisService.getClient().set(redisKey, jsonData, 'EX', 300);
      this.logger.log(`Stored complete response in Redis for sportId: ${sportId} with 5-minute TTL`);
    } catch (error) {
      this.logger.error(`Failed to store response in Redis for sportId: ${sportId}`, error.message);
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
    const sports = data.sports.map((sport: any) => ({
      sportId: sport.sportId || sportId,
      sport_name: sport.sport_name || sport.sportName || '',
      competitionId: sport.competitionId || sport.competition_id || '',
      competition_name: sport.competition_name || sport.competitionName || '',
      // Note: competitionName is an alias for competition_name
      competitionName: sport.competition_name || sport.competitionName || '',
      eventId: sport.eventId || sport.event_id || '',
      eventName: sport.eventName || sport.event_name || '',
      // Note: event_name is an alias for eventName
      event_name: sport.event_name || sport.eventName || '',
      openDate: sport.openDate || sport.open_date || '',
      eventDate: sport.eventDate || sport.event_date || '',
      eventTime: sport.eventTime || sport.event_time || '',
      homeTeam: sport.homeTeam || sport.home_team || '',
      awayTeam: sport.awayTeam || sport.away_team || '',
      // Note: home_team is an alias for homeTeam
      home_team: sport.home_team || sport.homeTeam || '',
      // Note: away_team is an alias for awayTeam
      away_team: sport.away_team || sport.awayTeam || '',
    }));

    this.logger.log(`Transformed ${sports.length} sports`);
    return { sports };
  }
}