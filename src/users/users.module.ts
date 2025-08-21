import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { Currency } from '../currency/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Currency]), 
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
