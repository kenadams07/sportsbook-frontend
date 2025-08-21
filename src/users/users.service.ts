import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find({ relations: ['currency'] });
  }

  create(payload: Partial<Users>): Promise<Users> {
    const user = this.usersRepository.create(payload);
    return this.usersRepository.save(user);
  }
}
