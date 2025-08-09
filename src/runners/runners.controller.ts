import { Controller, Get, Post, Body } from '@nestjs/common';
import { RunnersService } from './runners.service';
import { Runners } from './runners.entity';

@Controller('runners')
export class RunnersController {
  constructor(private readonly runnersService: RunnersService) {}

  @Get()
  findAll(): Promise<Runners[]> {
    return this.runnersService.findAll();
  }

  @Post()
  create(@Body() runner: Partial<Runners>): Promise<Runners> {
    return this.runnersService.create(runner);
  }
}
