import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelController } from './whiteLabel.controller';

describe('WhiteLabelController', () => {
  let controller: WhiteLabelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhiteLabelController],
    }).compile();

    controller = module.get<WhiteLabelController>(WhiteLabelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
