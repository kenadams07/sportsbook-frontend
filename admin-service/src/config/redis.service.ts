import { Injectable, OnModuleInit, Logger, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Get the configured Redis URL
    let redisUrl = this.configService.get<string>('REDIS_URL');
    this.logger.log(`Configured Redis URL: ${redisUrl}`);
    
    // For local development, we need to connect to localhost instead of 'redis' hostname
    if (redisUrl && redisUrl.includes('redis:')) {
      // Replace 'redis:' hostname with 'localhost:' for local development
      const localRedisUrl = redisUrl.replace('redis:', 'localhost:');
      this.logger.log(`Running locally, using modified Redis URL: ${localRedisUrl}`);
      redisUrl = localRedisUrl;
    }
    
    // If no Redis URL is configured, use localhost as default for local development
    if (!redisUrl) {
      redisUrl = 'redis://localhost:6379';
      this.logger.log(`No Redis URL configured, using default: ${redisUrl}`);
    }
    
    // Check if Redis is running on the specified host and port
    const isRedisRunning = await this.isRedisPortOpen(redisUrl);
    if (!isRedisRunning) {
      this.logger.error(`Redis is not running or not accessible at ${redisUrl}`);
      throw new InternalServerErrorException('Redis is not running or not accessible. Please start Redis server on localhost:6379');
    }
    
    try {
      this.logger.log(`Attempting to connect to Redis at ${redisUrl}`);
      this.client = new Redis(redisUrl);
      
      // Test the connection
      await this.client.ping();
      this.logger.log(`Successfully connected to Redis at ${redisUrl}`);
    } catch (error) {
      this.logger.error(`Failed to connect to Redis at ${redisUrl}: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      // Log additional error details
      this.logger.error(`Error code: ${error.code}`);
      if (error.errno) this.logger.error(`Error errno: ${error.errno}`);
      if (error.syscall) this.logger.error(`Error syscall: ${error.syscall}`);
      throw new InternalServerErrorException('Failed to connect to Redis. Please ensure Redis is running on localhost:6379');
    }
  }

  private async isRedisPortOpen(redisUrl: string): Promise<boolean> {
    try {
      const url = new URL(redisUrl);
      const host = url.hostname;
      const port = parseInt(url.port, 10);
      
      this.logger.log(`Checking if Redis port is open at ${host}:${port}`);
      
      return new Promise((resolve) => {
        const socket = new net.Socket();
        const timeout = 3000; // 3 seconds timeout
        
        socket.setTimeout(timeout);
        
        socket.on('connect', () => {
          this.logger.log(`Successfully connected to ${host}:${port}`);
          socket.destroy();
          resolve(true);
        });
        
        socket.on('timeout', () => {
          this.logger.error(`Connection to ${host}:${port} timed out`);
          socket.destroy();
          resolve(false);
        });
        
        socket.on('error', (err) => {
          this.logger.error(`Failed to connect to ${host}:${port}: ${err.message}`);
          socket.destroy();
          resolve(false);
        });
        
        socket.connect(port, host);
      });
    } catch (error) {
      this.logger.error(`Error parsing Redis URL or checking port: ${error.message}`);
      return false;
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