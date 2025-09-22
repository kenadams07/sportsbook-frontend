import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsDataService } from './events-data.service';
import { EventsDataController } from './events-data.controller';
import { Events } from './events.entity';
import { Sports } from '../sports/sports.entity';
import { Leagues } from '../leagues/leagues.entity';
import { Markets } from '../markets/markets.entity';
import { Runners } from '../runners/runners.entity';
import { RedisModule } from '../config/redis.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Events, Sports, Leagues, Markets, Runners]),
    RedisModule,
  ],
  providers: [EventsDataService],
  controllers: [EventsDataController],
})
export class EventsDataModule {}