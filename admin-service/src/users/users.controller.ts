import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRabbitMQService } from './users.rabbitmq.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './users.entity';
import { successResponse } from '../utils/helper';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRabbitMQService: UsersRabbitMQService,
  ) {}

  @Get('users-list')
  @UseGuards(AuthGuard)
  async list(): Promise<{
    status: boolean;
    code: number;
    message: string;
    data: User[];
  }> {
    const users = await this.usersRabbitMQService.findAll();
    return successResponse('Users fetched successfully', users);
  }
}
