import { Test, TestingModule } from '@nestjs/testing';
import { SportBetsService } from './sportBets.service';

describe('SportBetsService', () => {
  let service: SportBetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportBetsService],
    }).compile();

    service = module.get<SportBetsService>(SportBetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});