import { Controller, Get, Post, Body } from '@nestjs/common';
import { WhiteLabelService } from './whiteLabel.service';
import { WhiteLabel } from './whiteLabel.entity';

@Controller('whiteLabel')
export class WhiteLabelController {
  constructor(private readonly whiteLabelService: WhiteLabelService) {}

  @Get()
  findAll(): Promise<WhiteLabel[]> {
    return this.whiteLabelService.findAll();
  }

  @Post()
  create(@Body() whiteLabel: Partial<WhiteLabel>): Promise<WhiteLabel> {
    return this.whiteLabelService.create(whiteLabel);
  }
}
