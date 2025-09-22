import { Injectable, OnModuleInit, Logger, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.error('REDIS_URL is not defined in configuration');
      throw new InternalServerErrorException('Redis configuration is missing');
    }
    
    try {
      this.client = new Redis(redisUrl);
      
      // Test the connection
      await this.client.ping();
      this.logger.log(`Successfully connected to Redis at ${redisUrl}`);
    } catch (error) {
      this.logger.error(`Failed to connect to Redis at ${redisUrl}: ${error.message}`);
      throw new InternalServerErrorException('Failed to connect to Redis');
    }
  }

  getClient(): Redis {
    if (!this.client) {
      this.logger.error('Redis client is not initialized');
      throw new InternalServerErrorException('Redis client is not available');
    }
    return this.client;
  }
}