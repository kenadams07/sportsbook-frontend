import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { LoginHistory } from './login-history.entity';
import { LoginHistoryService } from './login-history.service';
import { Currency } from '../currency/currency.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Currency, LoginHistory]), 
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, LoginHistoryService],
  exports: [UsersService, LoginHistoryService],
})
export class UsersModule {}