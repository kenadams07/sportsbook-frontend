import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExposureService } from './exposure.service';
import { Exposure } from './exposure.entity';

@Controller('exposures')
export class ExposureController {
  constructor(private readonly exposureService: ExposureService) {}

  @Get()
  findAll(): Promise<Exposure[]> {
    return this.exposureService.findAll();
  }

  @Post()
  create(@Body() exposure: Partial<Exposure>): Promise<Exposure> {
    return this.exposureService.create(exposure);
  }
}
