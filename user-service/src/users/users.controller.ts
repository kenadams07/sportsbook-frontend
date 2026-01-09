import { Controller, Get, Post, Body, BadRequestException, HttpException, HttpStatus, Res, Logger, ValidationPipe, Req, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../currency/currency.entity';
import * as bcrypt from 'bcrypt';
import { errorResponse, successResponse } from '../utils/helper';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { USERS_CONSTANTS } from './users.constants';
import { LoginHistoryService } from './login-history.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    private readonly loginHistoryService: LoginHistoryService,
  ) { }

  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Post('signup')
  async create(@Body(new ValidationPipe()) signupDto: SignupDto, @Req() req, @Res() res) {
    try {
      console.log('Signup request received:', signupDto);
      
      // Set CORS headers manually since we're using @Res()
      // Match the allowed origins from main.ts
      const origin = req.get('Origin');
      const allowedOrigins = [
        'https://user-api.xfair91.com',
        'http://user-api.xfair91.com',
        'https://xfair91.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5002'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      const payload: Partial<Users> = { 
        username: signupDto.username,
        name: signupDto.name,
        email: signupDto.email,
        birthdate: new Date(signupDto.birthdate),
        password: signupDto.password,
        passwordText: signupDto.password,
        system_ip: signupDto.system_ip,
        browser_ip: signupDto.browser_ip
        // Note: parentId is not set during signup as this is for creating a new user without a parent
      };
      
      console.log('Processing signup payload:', payload);

      if (typeof payload.password !== 'string') {
        console.log('Password validation failed: not a string');
        return errorResponse('The "password" field is required and must be a string.', 400);
      }
      const rawPassword = payload.password.trim();
      if (!rawPassword) {
        console.log('Password validation failed: empty password');
        return errorResponse('The "password" field cannot be empty.', 400);
      }
      payload.passwordText = rawPassword;

      const looksBcryptHashed = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(rawPassword);
      console.log('Password hashing check:', { looksBcryptHashed, rawPassword });
      payload.password = looksBcryptHashed ? rawPassword : await bcrypt.hash(rawPassword, 12);
      console.log('Password hashed successfully');

      if (signupDto.currency) {
        console.log('Processing currency:', signupDto.currency);
        const currencyRecord = await this.currencyRepo.findOne({
          where: [{ name: signupDto.currency }, { code: signupDto.currency }],
        });

        if (!currencyRecord) {
          console.log('Currency not found:', signupDto.currency);
          return errorResponse(`Currency "${signupDto.currency}" does not exist.`, 400);
        }

        payload.currency = currencyRecord;
        console.log('Currency found:', currencyRecord);
      }

      console.log('Creating user with payload:', payload);
      const newUser = await this.usersService.create(payload);
      console.log('User creation result:', newUser);

      if (newUser) {
        console.log('Generating JWT token for user:', newUser.id);
        const token = this.usersService.generateJwtToken(newUser);
        console.log('JWT token generated');
        
        console.log('Updating user token:', newUser.id);
        await this.usersService.updateToken(newUser.id, token);
        console.log('User token updated');
        
        const response = {
          _id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          emailVerify: newUser.emailVerify,
          username: newUser.username,
          name: newUser.name,
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
        
        console.log('Sending successful response');
        return res.status(200).json({
          success: true,
          message: 'Signup Success.',
          data: response,
          token: token
        });
      }

    } catch (error) {
      console.error('Signup error:', error);
      // Set CORS headers for error responses as well
      const origin = req.get('Origin');
      const allowedOrigins = [
        'https://user-api.xfair91.com',
        'http://user-api.xfair91.com',
        'https://xfair91.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5002'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      console.log('Sending error response');
      return res.status(error.status || 500).json(
        errorResponse(
          error.response?.message || error.message || 'Something went wrong',
          error.status || 500
        )
      );
    }
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto, @Req() req, @Res() res) {
    try {
      console.log('Login request received:', loginDto);
      
      // Set CORS headers manually since we're using @Res()
      // Match the allowed origins from main.ts
      const origin = req.get('Origin');
      const allowedOrigins = [
        'https://user-api.xfair91.com',
        'http://user-api.xfair91.com',
        'https://xfair91.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5002'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      const { emailOrUsername, password, rememberMe } = loginDto;
      console.log('Processing login for:', emailOrUsername);
      
      let user: Users | null = null;
      
      if (emailOrUsername.includes('@')) {
        console.log('Looking up user by email:', emailOrUsername);
        user = await this.usersService.findOneByEmail(emailOrUsername);
      } else {
        console.log('Looking up user by username:', emailOrUsername);
        user = await this.usersRepository.findOne({
          where: { username: emailOrUsername },
          relations: ['currency']
        });
      }
      
      console.log('User lookup result:', user);
      
      if (!user) {
        console.log('User not found');
        return res.status(401).json(errorResponse('Invalid credentials', 401));
      }
      
      console.log('Verifying password');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password verification result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(401).json(errorResponse('Invalid credentials', 401));
      }
      
      console.log('Generating JWT token');
      const token = this.usersService.generateJwtToken(user);
      console.log('JWT token generated');
      
      console.log('Updating user token');
      await this.usersService.updateToken(user.id, token);
      console.log('User token updated');
      
      // Handle login history
      const existingLoginHistory = await this.loginHistoryService.findByEmailAndIPs(
        user.email,
        loginDto.system_ip,
        loginDto.browser_ip
      );
      
      if (existingLoginHistory) {
        // Update only the last_login timestamp for that record
        await this.loginHistoryService.updateLastLogin(existingLoginHistory.id);
      } else {
        // Create a new record in the login_history table
        await this.loginHistoryService.create({
          email: user.email,
          system_ip: loginDto.system_ip || user.system_ip,
          browser_ip: loginDto.browser_ip || user.browser_ip,
          created_at: new Date(),
          last_login: new Date()
        });
      }
      
      const response = {
        _id: user.id,
        email: user.email,
        role: user.role,
        emailVerify: user.emailVerify,
        username: user.username,
        name: user.name,
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
      
      console.log('Sending successful login response');
      return res.status(200).json({
        success: true,
        message: 'Login Success.',
        data: response,
        token: token
      });
      
    } catch (error) {
      console.error('Login error:', error);
      // Set CORS headers for error responses as well
      const origin = req.get('Origin');
      const allowedOrigins = [
        'https://user-api.xfair91.com',
        'http://user-api.xfair91.com',
        'https://xfair91.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5002'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      console.log('Sending error response');
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
      // Set CORS headers manually since we're using @Res()
      // Match the allowed origins from main.ts
      const origin = req.get('Origin');
      const allowedOrigins = [
        'https://user-api.xfair91.com',
        'http://user-api.xfair91.com',
        'https://xfair91.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5002'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      
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
        name: user.name,
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
      // Set CORS headers for error responses as well
      const origin = req.get('Origin');
      const allowedOrigins = [
        'https://user-api.xfair91.com',
        'http://user-api.xfair91.com',
        'https://xfair91.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5002'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      return res.status(error.status || 500).json(
        errorResponse(
          error.response?.message || error.message || 'Something went wrong',
          error.status || 500
        )
      );
    }
  }
}