import { Controller, Get, Post, Body, BadRequestException, HttpException, HttpStatus, Res, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../currency/currency.entity';
import * as bcrypt from 'bcrypt';
import { errorResponse, successResponse } from 'src/utils/helper';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { validate } from 'class-validator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) { }

  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Post('signup')
  async create(@Body() userData: { payload: Partial<Users> }, @Res() res) {
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

    
      const newUser = await this.usersService.create(payload);

      if (newUser) {
        // Generate JWT token
        const token = this.usersService.generateJwtToken(newUser);
        
        // Update user with token
        await this.usersService.updateToken(newUser.id, token);
        
        // Prepare response data with all user details
        const response = {
          _id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          emailVerify: newUser.emailVerify,
          username: newUser.username,
          zipcode: newUser.zipcode,
          name: newUser.name,
          address: newUser.address,
          middlename: newUser.middlename,
          occupation: newUser.occupation,
          salaryLevel: newUser.salaryLevel,
          surname: newUser.surname,
          gender: newUser.gender,
          birthdate: newUser.birthdate,
          clientShare: newUser.clientShare,
          creditReference: newUser.creditReference,
          balance: newUser.balance,
          system_ip: newUser.system_ip,
          browser_ip: newUser.browser_ip,
          status: newUser.status,
          betAllow: newUser.betAllow,
          // Include currency details if available
          currency: newUser.currency ? {
            id: newUser.currency.id,
            name: newUser.currency.name,
            code: newUser.currency.code
          } : null
        };

        // Delete sensitive fields
        delete (newUser as any).password;
        delete (newUser as any).passwordText;
        delete (newUser as any).token; // Don't send the token in the user data
        
        // Send verification email (don't fail the signup if email fails)
        const emailSent = await this.usersService.sendVerificationEmail(newUser.email);
        if (!emailSent) {
          this.logger.warn(`Failed to send verification email to ${newUser.email}`);
        }
        
        // Return success response with token as separate key
        return res.status(200).json({
          success: true,
          message: 'Signup Success.',
          data: response,
          token: token
        });
      }

    } catch (error) {
      return res.status(error.status || 500).json(
        errorResponse(
          error.response?.message || error.message || 'Something went wrong',
          error.status || 500
        )
      );
    }
  }

  @Post('verifyemail')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      // Validate DTO
      const errors = await validate(verifyEmailDto);
      if (errors.length > 0) {
        return errorResponse('Validation failed', 400);
      }

      const { email, route } = verifyEmailDto;
      
      // Generate and send OTP
      const otpSent = await this.usersService.sendVerificationEmail(email);
      
      if (otpSent) {
        return successResponse('OTP sent successfully', { emailVerification: route === 'VE' }, 200);
      } else {
        return errorResponse('Failed to send OTP. Please check your email configuration.', 500);
      }
    } catch (error) {
      return errorResponse(
        error.response?.message || error.message || 'Something went wrong',
        error.status || 500
      );
    }
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    try {
      // Validate DTO
      const errors = await validate(forgetPasswordDto);
      if (errors.length > 0) {
        return errorResponse('Validation failed', 400);
      }

      const { email } = forgetPasswordDto;
      
      // Generate and send password reset email
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        // For security reasons, we don't reveal if the email exists
        return successResponse('If the email exists, a password reset link has been sent', {}, 200);
      }

      // Generate reset token (in a real app, you'd want to store this in the database)
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Send password reset email
      const emailSent = await this.usersService.sendVerificationEmail(email); // Using the same method for now
      
      if (emailSent) {
        return successResponse('Password reset email sent successfully', {}, 200);
      } else {
        return errorResponse('Failed to send password reset email. Please check your email configuration.', 500);
      }
    } catch (error) {
      return errorResponse(
        error.response?.message || error.message || 'Something went wrong',
        error.status || 500
      );
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      // Validate DTO
      const errors = await validate(verifyOtpDto);
      if (errors.length > 0) {
        return errorResponse('Validation failed', 400);
      }

      const { email, otp } = verifyOtpDto;
      
      // Verify OTP
      const isValid = await this.usersService.verifyEmail(email, otp);
      
      if (isValid) {
        return successResponse('Email verified successfully', { emailVerified: true }, 200);
      } else {
        return errorResponse('Invalid or expired OTP', 400);
      }
    } catch (error) {
      return errorResponse(
        error.response?.message || error.message || 'Something went wrong',
        error.status || 500
      );
    }
  }
}