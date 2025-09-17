import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportBets } from './sportBets.entity';

@Injectable()
export class SportBetsService {
  constructor(
    @InjectRepository(SportBets)
    private sportBetsRepository: Repository<SportBets>,
  ) {}

  findAll(): Promise<SportBets[]> {
    return this.sportBetsRepository.find();
  }

  create(sportBet: Partial<SportBets>): Promise<SportBets> {
    return this.sportBetsRepository.save(sportBet);
  }
}
