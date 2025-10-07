import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GapCasino } from './entities/gap-casino.entity';
import { CreateGapCasinoDto } from './dto/create-gap-casino.dto';
import { UpdateGapCasinoDto } from './dto/update-gap-casino.dto';

@Injectable()
export class GapCasinoService {
  constructor(
    @InjectRepository(GapCasino)
    private gapCasinoRepository: Repository<GapCasino>,
  ) {}

  async create(createGapCasinoDto: CreateGapCasinoDto): Promise<GapCasino> {
    const gapCasino = this.gapCasinoRepository.create(createGapCasinoDto);
    return this.gapCasinoRepository.save(gapCasino);
  }

  async findAll(): Promise<GapCasino[]> {
    return this.gapCasinoRepository.find();
  }

  async findOne(id: string): Promise<GapCasino | null> {
    return this.gapCasinoRepository.findOne({ where: { id } });
  }

  async update(id: string, updateGapCasinoDto: UpdateGapCasinoDto): Promise<GapCasino | null> {
    await this.gapCasinoRepository.update(id, updateGapCasinoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.gapCasinoRepository.delete(id);
  }
}