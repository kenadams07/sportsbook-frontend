import { Module } from '@nestjs/common';
import { SportBetsController } from './sportBets.controller';
import { SportBetsService } from './sportBets.service';

@Module({
  controllers: [SportBetsController],
  providers: [SportBetsService],
  exports: [SportBetsService],
})
export class SportBetsModule {}