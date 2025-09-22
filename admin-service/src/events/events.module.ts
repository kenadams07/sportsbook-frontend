import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Events } from './events.entity';
import { RedisService } from '../config/redis.service';
import { Runners } from '../runners/runners.entity';
import { Markets } from '../markets/markets.entity';
import { Leagues } from '../leagues/leagues.entity';
import { Sports } from '../sports/sports.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Events, Runners, Markets, Leagues, Sports]),
  ],
  providers: [EventsService, RedisService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}