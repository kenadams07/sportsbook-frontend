import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportBetsService } from './sportBets.service';
import { SportBetsController } from './sportBets.controller';
import { SportBets } from './sportBets.entity';
import { UsersModule } from '../users/users.module';
import { Exposure } from '../exposure/exposure.entity';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([SportBets, Exposure]),
    UsersModule,
  ],
  providers: [SportBetsService, AppGateway],
  controllers: [SportBetsController],
})
export class SportBetsModule {}