import { Controller, Post, Body, Logger, Get, Query, BadRequestException } from '@nestjs/common';
import { EventsDataService } from './events-data.service';

@Controller('api/events-data')
export class EventsDataController {
  private readonly logger = new Logger(EventsDataController.name);

  constructor(private readonly eventsDataService: EventsDataService) {}

  @Post('process')
  async handleEventsData(@Body() data: any): Promise<any> {
    this.logger.log('Received events data:', JSON.stringify(data));
    try {
      const result = await this.eventsDataService.processEventsData(data);
      this.logger.log('Successfully processed events data');
      return result;
    } catch (error) {
      this.logger.error('Error processing events data:', error.stack);
      throw error;
    }
  }

  @Get('competitions/live')
  async getLiveCompetitions(@Query('sport_id') sportId: string): Promise<any> {
    this.logger.log(`Received request for live competitions with sport_id: ${sportId}`);
    
    if (!sportId) {
      this.logger.warn('Missing sport_id parameter in request');
      throw new BadRequestException('sport_id parameter is required');
    }

    try {
      const result = await this.eventsDataService.getLiveCompetitions(sportId);
      this.logger.log(`Successfully fetched live competitions, returning ${result.sports ? result.sports.length : 0} sports`);
      this.logger.log(`Response data: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Error fetching live competitions:', error.stack);
      // Return a default response to prevent 500 errors
      return { sports: [] };
    }
  }
}