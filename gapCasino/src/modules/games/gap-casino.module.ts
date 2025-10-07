import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GapCasino } from './entities/gap-casino.entity';
import { GapCasinoService } from './gap-casino.service';
import { GapCasinoController } from './gap-casino.controller';
import { GapCasinoGameModule } from './gap-casino-game.module';

@Module({
  imports: [TypeOrmModule.forFeature([GapCasino]), GapCasinoGameModule],
  controllers: [GapCasinoController],
  providers: [GapCasinoService],
  exports: [GapCasinoService],
})
export class GapCasinoModule {}