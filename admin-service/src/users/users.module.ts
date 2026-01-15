import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersRabbitMQService } from './users.rabbitmq.service';
import { UsersController } from './users.controller';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRabbitMQService, AuthGuard],
  exports: [UsersService, UsersRabbitMQService],
})
export class UsersModule {}
