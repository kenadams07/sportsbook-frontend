import { Test, TestingModule } from '@nestjs/testing';
import { ExposureController } from './exposure.controller';

describe('ExposureController', () => {
  let controller: ExposureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExposureController],
    }).compile();

    controller = module.get<ExposureController>(ExposureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
