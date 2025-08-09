import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exposure } from './exposure.entity';

@Injectable()
export class ExposureService {
  constructor(
    @InjectRepository(Exposure)
    private exposureRepository: Repository<Exposure>,
  ) {}

  findAll(): Promise<Exposure[]> {
    return this.exposureRepository.find();
  }

  create(exposure: Partial<Exposure>): Promise<Exposure> {
    return this.exposureRepository.save(exposure);
  }
}
