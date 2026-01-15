import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport, RmqOptions } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from './users.entity';

@Injectable()
export class UsersRabbitMQService {
  private client: ClientProxy;

  constructor() {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    
    const clientOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: 'user_queue',  // Using the same queue as in user service
        queueOptions: { durable: true },
      },
    };

    this.client = ClientProxyFactory.create(clientOptions);
  }

  async findAll(): Promise<User[]> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'get_users' }, {})
      );
      return response;
    } catch (error) {
      console.error('Error fetching users via RabbitMQ:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'get_user' }, { id })
      );
      return response;
    } catch (error) {
      console.error(`Error fetching user ${id} via RabbitMQ:`, error);
      throw error;
    }
  }

  async createUser(userData: any): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'create_user' }, userData)
      );
      return response;
    } catch (error) {
      console.error('Error creating user via RabbitMQ:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: any): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'update_user' }, { id, ...userData })
      );
      return response;
    } catch (error) {
      console.error(`Error updating user ${id} via RabbitMQ:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'delete_user' }, { id })
      );
      return response;
    } catch (error) {
      console.error(`Error deleting user ${id} via RabbitMQ:`, error);
      throw error;
    }
  }
}