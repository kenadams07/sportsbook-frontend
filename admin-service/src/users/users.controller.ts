import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './users.entity';
import { successResponse } from '../utils/helper';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users-list')
  @UseGuards(AuthGuard)
  async list(): Promise<{
    status: boolean;
    code: number;
    message: string;
    data: User[];
  }> {
    const users = await this.usersService.findAll();
    return successResponse('Users fetched successfully', users);
  }
}
