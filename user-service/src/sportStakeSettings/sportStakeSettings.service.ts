import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportStakeSettings } from './sportStakeSettings.entity';

@Injectable()
export class SportStakeSettingsService {
  constructor(
    @InjectRepository(SportStakeSettings)
    private sportStakeSettingsRepository: Repository<SportStakeSettings>,
  ) {}

  findAll(): Promise<SportStakeSettings[]> {
    return this.sportStakeSettingsRepository.find();
  }

  create(sportStakeSettings: Partial<SportStakeSettings>): Promise<SportStakeSettings> {
    return this.sportStakeSettingsRepository.save(sportStakeSettings);
  }
}
