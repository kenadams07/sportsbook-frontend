import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { Events } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<Events[]> {
    return this.eventsService.findAll();
  }

  @Post()
  create(@Body() events: Partial<Events>): Promise<Events> {
    return this.eventsService.create(events);
  }
}
