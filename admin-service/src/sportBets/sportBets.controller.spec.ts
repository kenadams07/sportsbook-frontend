import { Test, TestingModule } from '@nestjs/testing';
import { SportBetsController } from './sportBets.controller';

describe('SportBetsController', () => {
  let controller: SportBetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportBetsController],
    }).compile();

    controller = module.get<SportBetsController>(SportBetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
