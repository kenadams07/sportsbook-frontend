import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  findAll(): Promise<Events[]> {
    return this.eventsRepository.find();
  }

  create(events: Partial<Events>): Promise<Events> {
    return this.eventsRepository.save(events);
  }
}
