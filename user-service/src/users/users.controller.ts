import { Controller, Get, Post, Body, BadRequestException, HttpException, HttpStatus, Res, Logger, ValidationPipe, Req, Headers } from '@nestjs/common';
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
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { USERS_CONSTANTS } from './users.constants';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) { }

  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Post('signup')
  async create(@Body(new ValidationPipe()) signupDto: SignupDto, @Res() res) {
    try {
      const payload: Partial<Users> = { 
        username: signupDto.username,
        name: signupDto.name,
        email: signupDto.email,
        birthdate: new Date(signupDto.birthdate),
        password: signupDto.password,
        passwordText: signupDto.password
      };

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

      if (signupDto.currency) {
        const currencyRecord = await this.currencyRepo.findOne({
          where: [{ name: signupDto.currency }, { code: signupDto.currency }],
        });

        if (!currencyRecord) {
          return errorResponse(`Currency "${signupDto.currency}" does not exist.`, 400);
        }

        payload.currency = currencyRecord;
      }

      const newUser = await this.usersService.create(payload);

      if (newUser) {
        const token = this.usersService.generateJwtToken(newUser);
        
        await this.usersService.updateToken(newUser.id, token);
        
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
          currency: newUser.currency ? {
            id: newUser.currency.id,
            name: newUser.currency.name,
            code: newUser.currency.code
          } : null
        };

        delete (newUser as any).password;
        delete (newUser as any).passwordText;
        delete (newUser as any).token;
        
        const emailSent = await this.usersService.sendVerificationEmail(newUser.email);
        
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

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto, @Res() res) {
    try {
      const { emailOrUsername, password, rememberMe } = loginDto;
      
      let user: Users | null = null;
      
      if (emailOrUsername.includes('@')) {
        user = await this.usersService.findOneByEmail(emailOrUsername);
      } else {
        user = await this.usersRepository.findOne({
          where: { username: emailOrUsername },
          relations: ['currency']
        });
      }
      
      if (!user) {
        return res.status(401).json(errorResponse('Invalid credentials', 401));
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json(errorResponse('Invalid credentials', 401));
      }
      
      const token = this.usersService.generateJwtToken(user);
      
      await this.usersService.updateToken(user.id, token);
      
      const response = {
        _id: user.id,
        email: user.email,
        role: user.role,
        emailVerify: user.emailVerify,
        username: user.username,
        zipcode: user.zipcode,
        name: user.name,
        address: user.address,
        middlename: user.middlename,
        occupation: user.occupation,
        salaryLevel: user.salaryLevel,
        surname: user.surname,
        gender: user.gender,
        birthdate: user.birthdate,
        clientShare: user.clientShare,
        creditReference: user.creditReference,
        balance: user.balance,
        system_ip: user.system_ip,
        browser_ip: user.browser_ip,
        status: user.status,
        betAllow: user.betAllow,
        currency: user.currency ? {
          id: user.currency.id,
          name: user.currency.name,
          code: user.currency.code
        } : null
      };

      delete (response as any).password;
      delete (response as any).passwordText;
      delete (response as any).token;
      
      return res.status(200).json({
        success: true,
        message: 'Login Success.',
        data: response,
        token: token
      });
      
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
      const errors = await validate(verifyEmailDto);
      if (errors.length > 0) {
        return errorResponse('Validation failed', 400);
      }

      const { email, route } = verifyEmailDto;
      
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
      const errors = await validate(forgetPasswordDto);
      if (errors.length > 0) {
        return errorResponse('Validation failed', 400);
      }

      const { email } = forgetPasswordDto;
      
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        return successResponse('If the email exists, a password reset link has been sent', {}, 200);
      }

      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const emailSent = await this.usersService.sendVerificationEmail(email);
      
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
      const errors = await validate(verifyOtpDto);
      if (errors.length > 0) {
        return errorResponse('Validation failed', 400);
      }

      const { email, otp } = verifyOtpDto;
      
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

  @Get('profile')
  async getProfile(@Req() req, @Headers('authorization') authHeader: string, @Res() res) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(errorResponse('Authorization token is required', 401));
      }

      const token = authHeader.substring(7);

      let decoded: any;
      try {
        decoded = jwt.verify(token, USERS_CONSTANTS.JWT_SECRET);
      } catch (error) {
        return res.status(401).json(errorResponse('Invalid or expired token', 401));
      }

      const user = await this.usersService.findOneByEmail(decoded.email);
      
      if (!user) {
        return res.status(404).json(errorResponse('User not found', 404));
      }

      const response = {
        _id: user.id,
        email: user.email,
        role: user.role,
        emailVerify: user.emailVerify,
        username: user.username,
        zipcode: user.zipcode,
        name: user.name,
        address: user.address,
        middlename: user.middlename,
        occupation: user.occupation,
        salaryLevel: user.salaryLevel,
        surname: user.surname,
        gender: user.gender,
        birthdate: user.birthdate,
        clientShare: user.clientShare,
        creditReference: user.creditReference,
        balance: user.balance,
        system_ip: user.system_ip,
        browser_ip: user.browser_ip,
        status: user.status,
        betAllow: user.betAllow,
        exposure: user.exposure || 0,
        currency: user.currency ? {
          id: user.currency.id,
          name: user.currency.name,
          code: user.currency.code
        } : null
      };

      delete (response as any).password;
      delete (response as any).passwordText;
      delete (response as any).token;

      return res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: response
      });
    } catch (error) {
      return res.status(error.status || 500).json(
        errorResponse(
          error.response?.message || error.message || 'Something went wrong',
          error.status || 500
        )
      );
    }
  }
}