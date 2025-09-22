import { Controller, Get, Query, Logger, Header, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('competitions')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get('live')
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
}