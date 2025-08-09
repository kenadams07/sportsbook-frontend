import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunnersService } from './runners.service';
import { RunnersController } from './runners.controller';
import { Runners } from './runners.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Runners])],
  providers: [RunnersService],
  controllers: [RunnersController],
})
export class RunnersModule {}
