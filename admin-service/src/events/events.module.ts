import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Events } from './events.entity';
import { RedisService } from '../config/redis.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Events]),
  ],
  providers: [EventsService, RedisService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}