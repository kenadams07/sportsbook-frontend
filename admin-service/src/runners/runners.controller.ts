import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RunnersService } from './runners.service';
import { Runners } from './runners.entity';

@Controller('api/runners')
export class RunnersController {
  constructor(private readonly runnersService: RunnersService) {}

  @Get()
  findAll(): Promise<Runners[]> {
    return this.runnersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Runners | null> {
    return this.runnersService.findOne(id);
  }

  @Post()
  create(@Body() runnersData: Partial<Runners>): Promise<Runners> {
    return this.runnersService.create(runnersData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() runnersData: Partial<Runners>): Promise<Runners | null> {
    return this.runnersService.update(id, runnersData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.runnersService.remove(id);
  }
}