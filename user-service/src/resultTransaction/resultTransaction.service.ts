import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultTransaction } from './resultTransaction.entity';

@Injectable()
export class ResultTransationService {
  constructor(
    @InjectRepository(ResultTransaction)
    private resultTransactionRepository: Repository<ResultTransaction>,
  ) {}

  findAll(): Promise<ResultTransaction[]> {
    return this.resultTransactionRepository.find();
  }

  create(resultTransaction: Partial<ResultTransaction>): Promise<ResultTransaction> {
    return this.resultTransactionRepository.save(resultTransaction);
  }
}
