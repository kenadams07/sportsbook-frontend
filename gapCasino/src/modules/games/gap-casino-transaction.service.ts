import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GapCasinoTransaction } from './entities/gap-casino-transaction.entity';
import { CreateGapCasinoTransactionDto } from './dto/create-gap-casino-transaction.dto';
import { UpdateGapCasinoTransactionDto } from './dto/update-gap-casino-transaction.dto';

@Injectable()
export class GapCasinoTransactionService {
  constructor(
    @InjectRepository(GapCasinoTransaction)
    private gapCasinoTransactionRepository: Repository<GapCasinoTransaction>,
  ) {}

  async create(createGapCasinoTransactionDto: CreateGapCasinoTransactionDto): Promise<GapCasinoTransaction> {
    const gapCasinoTransaction = this.gapCasinoTransactionRepository.create(createGapCasinoTransactionDto);
    return this.gapCasinoTransactionRepository.save(gapCasinoTransaction);
  }

  async findAll(): Promise<GapCasinoTransaction[]> {
    return this.gapCasinoTransactionRepository.find();
  }

  async findOne(id: string): Promise<GapCasinoTransaction | null> {
    return this.gapCasinoTransactionRepository.findOne({ where: { id } });
  }

  async update(id: string, updateGapCasinoTransactionDto: UpdateGapCasinoTransactionDto): Promise<GapCasinoTransaction | null> {
    await this.gapCasinoTransactionRepository.update(id, updateGapCasinoTransactionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.gapCasinoTransactionRepository.delete(id);
  }
}