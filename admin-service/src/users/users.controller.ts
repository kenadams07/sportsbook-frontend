import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRabbitMQService } from './users.rabbitmq.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './users.entity';
import { successResponse, errorResponse } from '../utils/helper';

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
    const users = await this.usersService.findAll();
    return successResponse('Users fetched successfully', users);
  }

  @Post('add-user-balance')
  @UseGuards(AuthGuard)
  async addUserBalance(@Body() payload: { userId: string; amount: number }) {
    if (!payload || !payload.userId || payload.amount === undefined) {
      return errorResponse('Invalid payload', 400);
    }

    const amount = Number(payload.amount);
    if (!Number.isFinite(amount)) {
      return errorResponse('Invalid amount', 400);
    }

    const result = await this.usersService.addUserBalance(
      payload.userId,
      amount,
    );

    if (!result) {
      return errorResponse('User not found', 404);
    }

    return successResponse('Balance updated successfully', {
      userId: payload.userId,
      previousBalance: result.previousBalance,
      newBalance: result.newBalance,
    });
  }

  @Post('withdraw-user-balance')
  @UseGuards(AuthGuard)
  async withdrawUserBalance(@Body() payload: { userId: string; amount: number }) {
    if (!payload || !payload.userId || payload.amount === undefined) {
      return errorResponse('Invalid payload', 400);
    }

    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return errorResponse('Invalid amount', 400);
    }

    try {
      const result = await this.usersService.withdrawUserBalance(
        payload.userId,
        amount,
      );

      if (!result) {
        return errorResponse('User not found', 404);
      }

      return successResponse('Withdrawal successful', {
        userId: payload.userId,
        previousBalance: result.previousBalance,
        newBalance: result.newBalance,
      });
    } catch (error) {
      if (error.message === 'Insufficient balance') {
        return errorResponse('Insufficient balance', 400);
      }
      return errorResponse('Internal server error', 500);
    }
  }
}
