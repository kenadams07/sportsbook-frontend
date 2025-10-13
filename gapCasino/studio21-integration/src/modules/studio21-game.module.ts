import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studio21GameService } from './studio21-game.service';
import { Studio21GameController } from './studio21-game.controller';
import { Studio21Game } from '../entities/studio21-game.entity';
import { Studio21Transaction } from '../entities/studio21-transaction.entity';
import { Studio21UserToken } from '../entities/studio21-user-token.entity';
import { User } from '../entities/user.entity';
import { SignatureModule } from '../utils/signature.module';

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