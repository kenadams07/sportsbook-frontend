import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GapCasinoGameService } from './gap-casino-game.service';
import { GapCasinoGameController } from './gap-casino-game.controller';
import { GapCasino } from './entities/gap-casino.entity';
import { GapCasinoTransaction } from './entities/gap-casino-transaction.entity';
import { GapCasinoUserToken } from './entities/gap-casino-user-token.entity';
import { User } from '../users/entities/user.entity';
import { UtilsModule } from '../../common/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GapCasino, GapCasinoTransaction, GapCasinoUserToken, User]),
    UtilsModule,
  ],
  controllers: [GapCasinoGameController],
  providers: [GapCasinoGameService],
  exports: [GapCasinoGameService],
})
export class GapCasinoGameModule {}