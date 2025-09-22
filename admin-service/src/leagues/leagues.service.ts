import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leagues } from './leagues.entity';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(Leagues)
    private leaguesRepository: Repository<Leagues>,
  ) {}

  async findAll(): Promise<Leagues[]> {
    return this.leaguesRepository.find();
  }

  async findOne(id: string): Promise<Leagues | null> {
    return this.leaguesRepository.findOne({ where: { id } });
  }

  async findByLeagueId(leagueId: string): Promise<Leagues | null> {
    return this.leaguesRepository.findOne({ where: { leagueId } });
  }

  async create(leagueData: Partial<Leagues>): Promise<Leagues> {
    const league = this.leaguesRepository.create(leagueData);
    return this.leaguesRepository.save(league);
  }

  async update(id: string, leagueData: Partial<Leagues>): Promise<Leagues | null> {
    await this.leaguesRepository.update(id, leagueData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.leaguesRepository.delete(id);
  }
}