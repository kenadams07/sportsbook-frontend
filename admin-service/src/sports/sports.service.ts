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

  async findAll(): Promise<Sports[]> {
    return this.sportsRepository.find();
  }

  async findOne(id: string): Promise<Sports | null> {
    return this.sportsRepository.findOne({ where: { id } });
  }

  async create(sportsData: Partial<Sports>): Promise<Sports> {
    const sports = this.sportsRepository.create(sportsData);
    return this.sportsRepository.save(sports);
  }

  async update(id: string, sportsData: Partial<Sports>): Promise<Sports | null> {
    await this.sportsRepository.update(id, sportsData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.sportsRepository.delete(id);
  }
}