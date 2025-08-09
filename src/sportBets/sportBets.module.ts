import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportBetsService } from './sportBets.service';
import { SportBetsController } from './sportBets.controller';
import { SportBets } from './sportBets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SportBets])],
  providers: [SportBetsService],
  controllers: [SportBetsController],
})
export class SportBetsModule {}
