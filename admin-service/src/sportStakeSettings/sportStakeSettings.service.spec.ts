import { Test, TestingModule } from '@nestjs/testing';
import { SportStakeSettingsService } from './sportStakeSettings.service';

describe('SportStakeSettingsService', () => {
  let service: SportStakeSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportStakeSettingsService],
    }).compile();

    service = module.get<SportStakeSettingsService>(SportStakeSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});