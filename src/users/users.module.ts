import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { Currency } from '../currency/currency.entity';
import { EmailModule } from '../email/email.module';
import { ExposureModule } from '../exposure/exposure.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Currency]), 
    EmailModule,
    ExposureModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}