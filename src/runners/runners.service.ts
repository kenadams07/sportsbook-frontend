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

  findAll(): Promise<Runners[]> {
    return this.runnersRepository.find();
  }

  create(runner: Partial<Runners>): Promise<Runners> {
    return this.runnersRepository.save(runner);
  }
}
