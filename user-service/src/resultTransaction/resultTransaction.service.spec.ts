import { Test, TestingModule } from '@nestjs/testing';
import { ResultTransationService } from './resultTransaction.service';

describe('ResultTransationService', () => {
  let service: ResultTransationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultTransationService],
    }).compile();

    service = module.get<ResultTransationService>(ResultTransationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
