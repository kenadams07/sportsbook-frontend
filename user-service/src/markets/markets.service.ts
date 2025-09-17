import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Markets } from './markets.entity';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Markets)
    private marketRepository: Repository<Markets>,
  ) { }

  findAll(): Promise<Markets[]> {
    return this.marketRepository.find();
  }

  create(market: Partial<Markets>): Promise<Markets> {
    return this.marketRepository.save(market);
  }
}
