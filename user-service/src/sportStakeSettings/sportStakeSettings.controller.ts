import { Controller, Get, Post, Body } from '@nestjs/common';
import { SportStakeSettingsService } from './sportStakeSettings.service';
import { SportStakeSettings } from './sportStakeSettings.entity';

@Controller('sportStakeSettings')
export class SportStakeSettingsController {
  constructor(private readonly sportStakeSettingsService: SportStakeSettingsService) {}

  @Get()
  findAll(): Promise<SportStakeSettings[]> {
    return this.sportStakeSettingsService.findAll();
  }

  @Post()
  create(@Body() sportStakeSetting: Partial<SportStakeSettings>): Promise<SportStakeSettings> {
    return this.sportStakeSettingsService.create(sportStakeSetting);
  }
}
