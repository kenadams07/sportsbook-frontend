import { Test, TestingModule } from '@nestjs/testing';
import { SportStakeSettingsController } from './sportStakeSettings.controller';

describe('SportStakeSettingsController', () => {
  let controller: SportStakeSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportStakeSettingsController],
    }).compile();

    controller = module.get<SportStakeSettingsController>(SportStakeSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
