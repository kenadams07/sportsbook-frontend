import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';
import { USERS_CONSTANTS } from './users.constants';

@Injectable()
export class UsersService {
  private otpStorage: Map<string, { otp: string; expires: Date }> = new Map();

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly emailService: EmailService,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find({ relations: ['currency'] });
  }

  async findOneById(id: string): Promise<Users | null> {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['currency'] 
    });
  }

  async create(payload: Partial<Users>): Promise<Users> {
    const user = this.usersRepository.create(payload);
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      relations: ['currency'] 
    });
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  storeOTP(email: string, otp: string): void {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    this.otpStorage.set(email, { otp, expires });
  }

  verifyOTP(email: string, otp: string): boolean {
    const storedOTP = this.otpStorage.get(email);
    if (!storedOTP) {
      return false;
    }

    if (new Date() > storedOTP.expires) {
      this.otpStorage.delete(email);
      return false;
    }

    if (storedOTP.otp === otp) {
      this.otpStorage.delete(email);
      return true;
    }

    return false;
  }

  async sendVerificationEmail(email: string): Promise<boolean> {
    try {
      const otp = this.generateOTP();
      this.storeOTP(email, otp);

      const result = await this.emailService.sendOTPMail(email, otp);
      
      return result;
    } catch (error) {
      return false;
    }
  }

  async verifyEmail(email: string, otp: string): Promise<boolean> {
    const isValid = this.verifyOTP(email, otp);
    
    if (isValid) {
      const user = await this.findOneByEmail(email);
      if (user) {
        user.emailVerify = new Date();
        await this.usersRepository.save(user);
      }
    }

    return isValid;
  }

  generateJwtToken(user: Users): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(payload, USERS_CONSTANTS.JWT_SECRET, {
      expiresIn: USERS_CONSTANTS.TOKEN_EXPIRESIN,
    } as jwt.SignOptions);
    
    return token;
  }

  async updateToken(userId: string, token: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { token });
  }

  async updateUserExposure(userId: string, exposure: number): Promise<void> {
    await this.usersRepository.update({ id: userId }, { exposure });
  }
}