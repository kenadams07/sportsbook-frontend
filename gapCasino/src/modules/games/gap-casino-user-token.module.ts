import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GapCasinoUserToken } from './entities/gap-casino-user-token.entity';
import { GapCasinoUserTokenService } from './gap-casino-user-token.service';
import { GapCasinoUserTokenController } from './gap-casino-user-token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GapCasinoUserToken])],
  controllers: [GapCasinoUserTokenController],
  providers: [GapCasinoUserTokenService],
  exports: [GapCasinoUserTokenService],
})
export class GapCasinoUserTokenModule {}