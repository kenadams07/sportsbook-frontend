import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import axios from 'axios';

@Injectable()
export class UsersService {
  private readonly userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Standard CRUD methods for local User entity
   * These methods work with the local simplified User entity
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * Microservice communication methods
   * These methods communicate with the separate User service for complex operations
   */

  /**
   * Fetch user details from the User microservice
   * This method communicates with the separate User service instead of duplicating entities
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await axios.get(`${this.userServiceUrl}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${userId} from user service:`, error.message);
      return null;
    }
  }

  /**
   * Update user balance in the User microservice
   * This ensures data consistency across services
   */
  async updateUserBalance(userId: string, balance: number): Promise<boolean> {
    try {
      await axios.patch(`${this.userServiceUrl}/users/${userId}/balance`, { balance });
      return true;
    } catch (error) {
      console.error(`Failed to update user ${userId} balance in user service:`, error.message);
      return false;
    }
  }

  /**
   * Validate user credentials with the User microservice
   */
  async validateUserCredentials(username: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post(`${this.userServiceUrl}/auth/validate`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to validate user credentials:`, error.message);
      return null;
    }
  }
}