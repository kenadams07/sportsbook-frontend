import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../currency/currency.entity';
import * as bcrypt from 'bcrypt';
import { errorResponse, successResponse } from 'src/utils/helper';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) { }

  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() userData: { payload: Partial<Users> }) {
    try {
      const payload = { ...userData.payload };

      
      if (typeof payload.password !== 'string') {
        return errorResponse('The "password" field is required and must be a string.', 400);
      }
      const rawPassword = payload.password.trim();
      if (!rawPassword) {
        return errorResponse('The "password" field cannot be empty.', 400);
      }
      payload.passwordText = rawPassword;

 
      const looksBcryptHashed = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(rawPassword);
      payload.password = looksBcryptHashed ? rawPassword : await bcrypt.hash(rawPassword, 12);

      if (payload.currency && typeof payload.currency === 'string') {
        const currencyRecord = await this.currencyRepo.findOne({
          where: [{ name: payload.currency }, { code: payload.currency }],
        });

        if (!currencyRecord) {
          return errorResponse(`Currency "${payload.currency}" does not exist.`, 400);
        }

        payload.currency = currencyRecord;
      }

    
      const user = await this.usersService.create(payload);

      if (user) {
        delete (user as any).password;
        delete (user as any).passwordText;
      }

      return successResponse('Signed up Successfully.', user, 200);

    } catch (error) {
      return errorResponse(
        error.response?.message || error.message || 'Something went wrong',
        error.status || 500
      );
    }
  }

}
