import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhiteLabel } from './whiteLabel.entity';

@Injectable()
export class WhiteLabelService {
  constructor(
    @InjectRepository(WhiteLabel)
    private whiteLabelRepository: Repository<WhiteLabel>,
  ) {}

  findAll(): Promise<WhiteLabel[]> {
    return this.whiteLabelRepository.find();
  }

  create(whiteLabel: Partial<WhiteLabel>): Promise<WhiteLabel> {
    return this.whiteLabelRepository.save(whiteLabel);
  }
}
