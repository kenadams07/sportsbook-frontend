import { Test, TestingModule } from '@nestjs/testing';
import { ResultTransactionService } from './resultTransaction.service';

describe('ResultTransactionService', () => {
  let service: ResultTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultTransactionService],
    }).compile();

    service = module.get<ResultTransactionService>(ResultTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});