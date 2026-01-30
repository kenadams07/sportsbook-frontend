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
    return this.usersRepository.find({
      relations: ['currency'],
    });
  }

  async addUserBalance(
    userId: string,
    amount: number,
  ): Promise<{ previousBalance: number; newBalance: number } | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    const previousBalance = Number(user.balance) || 0;
    const newBalance = previousBalance + Number(amount);
    await this.usersRepository.update(userId, { balance: newBalance });
    return { previousBalance, newBalance };
  }

  async withdrawUserBalance(
    userId: string,
    amount: number,
  ): Promise<{ previousBalance: number; newBalance: number } | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    const previousBalance = Number(user.balance) || 0;
    
    // Check if user has sufficient balance
    if (previousBalance < amount) {
      throw new Error('Insufficient balance');
    }

    const newBalance = previousBalance - Number(amount);
    await this.usersRepository.update(userId, { balance: newBalance });
    return { previousBalance, newBalance };
  }
}
