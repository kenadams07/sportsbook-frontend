import { Controller, Get, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ExposureService } from './exposure.service';
import { Exposure } from './exposure.entity';

@Controller('exposures')
export class ExposureController {
  private readonly logger = new Logger(ExposureController.name);

  constructor(private readonly exposureService: ExposureService) {}

  @Get()
  async findAll(): Promise<Exposure[]> {
    try {
      return await this.exposureService.findAll();
    } catch (error) {
      this.logger.error('Error fetching exposures', error.stack);
      throw new HttpException('Error fetching exposures', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() exposure: Partial<Exposure>): Promise<Exposure> {
    try {
      return await this.exposureService.create(exposure);
    } catch (error) {
      this.logger.error('Error creating exposure', error.stack);
      throw new HttpException('Error creating exposure', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('update-exposure')
  async updateExposure(@Body() payload: {
    marketId: string;
    eventId?: string;
    userId: string;
    is_clear: string;
    marketType: string;
    exposure: number;
  }): Promise<Exposure> {
    try {
      // Validate required fields
      if (!payload.marketId || !payload.userId) {
        throw new HttpException('marketId and userId are required', HttpStatus.BAD_REQUEST);
      }

      return await this.exposureService.upsertExposure(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('Error updating exposure', error.stack);
      throw new HttpException('Error updating exposure', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}