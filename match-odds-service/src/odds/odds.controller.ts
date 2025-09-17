import { Controller, Get } from '@nestjs/common';
import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Get()
  getCurrentOdds() {
    return this.oddsService.getOdds();
  }
}
