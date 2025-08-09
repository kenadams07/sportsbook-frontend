import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sports } from './sports.entity';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sports)
    private sportsRepository: Repository<Sports>,
  ) {}

  findAll(): Promise<Sports[]> {
    return this.sportsRepository.find();
  }

  create(sport: Partial<Sports>): Promise<Sports> {
    return this.sportsRepository.save(sport);
  }
}
