import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GapCasinoUserToken } from './entities/gap-casino-user-token.entity';
import { CreateGapCasinoUserTokenDto } from './dto/create-gap-casino-user-token.dto';
import { UpdateGapCasinoUserTokenDto } from './dto/update-gap-casino-user-token.dto';

@Injectable()
export class GapCasinoUserTokenService {
  constructor(
    @InjectRepository(GapCasinoUserToken)
    private gapCasinoUserTokenRepository: Repository<GapCasinoUserToken>,
  ) {}

  async create(createGapCasinoUserTokenDto: CreateGapCasinoUserTokenDto): Promise<GapCasinoUserToken> {
    const gapCasinoUserToken = this.gapCasinoUserTokenRepository.create(createGapCasinoUserTokenDto);
    return this.gapCasinoUserTokenRepository.save(gapCasinoUserToken);
  }

  async findAll(): Promise<GapCasinoUserToken[]> {
    return this.gapCasinoUserTokenRepository.find();
  }

  async findOne(id: string): Promise<GapCasinoUserToken | null> {
    return this.gapCasinoUserTokenRepository.findOne({ where: { id } });
  }

  async update(id: string, updateGapCasinoUserTokenDto: UpdateGapCasinoUserTokenDto): Promise<GapCasinoUserToken | null> {
    await this.gapCasinoUserTokenRepository.update(id, updateGapCasinoUserTokenDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.gapCasinoUserTokenRepository.delete(id);
  }
}