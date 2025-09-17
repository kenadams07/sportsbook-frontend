import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';
import { USERS_CONSTANTS } from './users.constants';

@Injectable()
export class UsersService {
  private otpStorage: Map<string, { otp: string; expires: Date }> = new Map();
  private readonly logger = new Logger(UsersService.name);

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
    // Generate a 6-digit random OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  storeOTP(email: string, otp: string): void {
    // Store OTP with 5 minutes expiration
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    this.otpStorage.set(email, { otp, expires });
    this.logger.log(`Stored OTP for ${email}, expires at ${expires}`);
  }

  verifyOTP(email: string, otp: string): boolean {
    const storedOTP = this.otpStorage.get(email);
    if (!storedOTP) {
      this.logger.log(`No OTP found for ${email}`);
      return false;
    }

    // Check if OTP is expired
    if (new Date() > storedOTP.expires) {
      this.otpStorage.delete(email);
      this.logger.log(`OTP expired for ${email}`);
      return false;
    }

    // Check if OTP matches
    if (storedOTP.otp === otp) {
      // Remove OTP after successful verification
      this.otpStorage.delete(email);
      this.logger.log(`OTP verified successfully for ${email}`);
      return true;
    }

    this.logger.log(`Invalid OTP for ${email}`);
    return false;
  }

  async sendVerificationEmail(email: string): Promise<boolean> {
    try {
      const otp = this.generateOTP();
      this.storeOTP(email, otp);

      this.logger.log(`Sending OTP ${otp} to ${email}`);
      const result = await this.emailService.sendOTPMail(email, otp);
      
      if (result) {
        this.logger.log(`Email sent successfully to ${email}`);
      } else {
        this.logger.warn(`Failed to send email to ${email}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error sending verification email to ${email}:`, error);
      return false;
    }
  }

  async verifyEmail(email: string, otp: string): Promise<boolean> {
    // For security reasons, we don't reveal if the email exists
    // We always try to verify the OTP regardless of user existence
    const isValid = this.verifyOTP(email, otp);
    
    if (isValid) {
      // If OTP is valid, update user's email verification status if user exists
      const user = await this.findOneByEmail(email);
      if (user) {
        user.emailVerify = new Date();
        await this.usersRepository.save(user);
        this.logger.log(`Email verified for user ${user.id}`);
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

    this.logger.log('Generating JWT token with secret:', USERS_CONSTANTS.JWT_SECRET);
    this.logger.log('Payload:', payload);
    
    const token = jwt.sign(payload, USERS_CONSTANTS.JWT_SECRET, {
      expiresIn: USERS_CONSTANTS.TOKEN_EXPIRESIN,
    } as jwt.SignOptions);
    
    this.logger.log('Generated token:', token);
    return token;
  }

  async updateToken(userId: string, token: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { token });
  }
}