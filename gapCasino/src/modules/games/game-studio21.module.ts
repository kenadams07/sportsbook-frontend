import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studio21GameService } from './game-studio21.service';
import { Studio21GameController } from './game-studio21.controller';
import { Studio21Game } from './entities/game-studio21.entity';
import { Studio21Transaction } from './entities/transaction-studio21.entity';
import { Studio21UserToken } from './entities/user-token-studio21.entity';
import { User } from './entities/user-studio21.entity';
import { SignatureModule } from '../../common/utils/studio21/signature-studio21.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Studio21Game, Studio21Transaction, Studio21UserToken, User]),
    SignatureModule,
  ],
  controllers: [Studio21GameController],
  providers: [Studio21GameService],
  exports: [Studio21GameService],
})
export class Studio21GameModule {}