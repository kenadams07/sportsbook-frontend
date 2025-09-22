import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Runners } from './runners.entity';

@Injectable()
export class RunnersService {
  constructor(
    @InjectRepository(Runners)
    private runnersRepository: Repository<Runners>,
  ) {}

  async findAll(): Promise<Runners[]> {
    return this.runnersRepository.find();
  }

  async findOne(id: string): Promise<Runners | null> {
    return this.runnersRepository.findOne({ where: { id } });
  }

  async create(runnersData: Partial<Runners>): Promise<Runners> {
    const runners = this.runnersRepository.create(runnersData);
    return this.runnersRepository.save(runners);
  }

  async update(id: string, runnersData: Partial<Runners>): Promise<Runners | null> {
    await this.runnersRepository.update(id, runnersData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.runnersRepository.delete(id);
  }
}