import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UsersRabbitMQService } from './users.rabbitmq.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersRabbitMQService: UsersRabbitMQService,
  ) {}

  async findAll(): Promise<User[]> {
    // Use the RabbitMQ service to fetch users from the user service
    return this.usersRabbitMQService.findAll();
  }
}
