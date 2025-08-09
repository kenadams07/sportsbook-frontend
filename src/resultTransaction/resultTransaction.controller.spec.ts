import { Test, TestingModule } from '@nestjs/testing';
import { ResultTransactionController } from './resultTransaction.controller';

describe('ResultTransactionController', () => {
  let controller: ResultTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultTransactionController],
    }).compile();

    controller = module.get<ResultTransactionController>(ResultTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
