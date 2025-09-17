import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { Sports } from './sports.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sports])],
  providers: [SportsService],
  controllers: [SportsController],
})
export class SportsModule {}
