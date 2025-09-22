import { Controller, Get, Query, Logger, Header, BadRequestException, InternalServerErrorException, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('api/events-data')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get('test-redis')
  async testRedis(): Promise<any> {
    this.logger.log('Received request to test Redis connection');
    try {
      const isConnected = await this.eventsService.testRedisConnection();
      return {
        success: isConnected,
        message: isConnected ? 'Redis connection successful' : 'Redis connection failed'
      };
    } catch (error) {
      this.logger.error('Error testing Redis connection', error.stack);
      throw new InternalServerErrorException('Failed to test Redis connection');
    }
  }

  @Get('debug-redis')
  async debugRedis(): Promise<any> {
    this.logger.log('Received request to debug Redis connection');
    try {
      const result = await this.eventsService.debugRedis();
      return result;
    } catch (error) {
      this.logger.error('Error debugging Redis connection', error.stack);
      throw new InternalServerErrorException('Failed to debug Redis connection');
    }
  }

  @Get('competitions/live')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getLiveEvents(@Query('sport_id') sportId: string): Promise<any> {
    this.logger.log(`Received request for live events with sport_id: ${sportId}`);
    
    try {
      // Validate the sportId parameter
      if (!sportId) {
        this.logger.error('Missing sport_id parameter');
        throw new BadRequestException('sport_id parameter is required');
      }
      
      const result = await this.eventsService.getLiveEvents(sportId);
      this.logger.log(`Successfully fetched live events for sport_id: ${sportId}`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching live events for sport_id: ${sportId}`, error.stack);
      
      // Return a more user-friendly error message
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to fetch live events data');
    }
  }

  @Post('process')
  async processEventsData(@Body() payload: any): Promise<any> {
    this.logger.log(`Received request to process events data`, JSON.stringify(payload));
    
    try {
      const result = await this.eventsService.processEventsData(payload);
      this.logger.log(`Successfully processed events data`);
      return result;
    } catch (error) {
      this.logger.error(`Error processing events data`, error.stack);
      throw new InternalServerErrorException('Failed to process events data');
    }
  }
}