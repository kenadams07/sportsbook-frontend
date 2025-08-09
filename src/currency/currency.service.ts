import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  findAll(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  create(user: Partial<Currency>): Promise<Currency> {
    return this.currencyRepository.save(user);
  }
}
