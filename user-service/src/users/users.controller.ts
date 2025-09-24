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
      this.logger.log('Signup request received', JSON.stringify(signupDto));
      
      // Check if passwords match
      if (signupDto.password !== signupDto.confirmPassword) {
        this.logger.warn('Passwords do not match');
        return errorResponse('Passwords do not match', 400);
      }

      // Prepare payload for user creation
      const payload: Partial<Users> = { 
        username: signupDto.username,
        name: signupDto.name,
        email: signupDto.email,
        birthdate: new Date(signupDto.birthdate),
        password: signupDto.password,
        passwordText: signupDto.password
      };

      if (typeof payload.password !== 'string') {
        this.logger.warn('Password is not a string');
        return errorResponse('The "password" field is required and must be a string.', 400);
      }
      const rawPassword = payload.password.trim();
      if (!rawPassword) {
        this.logger.warn('Password is empty');
        return errorResponse('The "password" field cannot be empty.', 400);
      }
      payload.passwordText = rawPassword;

      const looksBcryptHashed = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(rawPassword);
      payload.password = looksBcryptHashed ? rawPassword : await bcrypt.hash(rawPassword, 12);

      // Handle currency
      if (signupDto.currency) {
        this.logger.log(`Looking up currency: ${signupDto.currency}`);
        const currencyRecord = await this.currencyRepo.findOne({
          where: [{ name: signupDto.currency }, { code: signupDto.currency }],
        });

        if (!currencyRecord) {
          this.logger.warn(`Currency "${signupDto.currency}" does not exist`);
          return errorResponse(`Currency "${signupDto.currency}" does not exist.`, 400);
        }

        this.logger.log(`Found currency: ${currencyRecord.name}`);
        payload.currency = currencyRecord;
      }

      this.logger.log('Creating user with payload', JSON.stringify(payload));
      const newUser = await this.usersService.create(payload);
      this.logger.log('User created successfully', newUser?.id);

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
        this.logger.log(`Sending verification email to ${newUser.email}`);
        const emailSent = await this.usersService.sendVerificationEmail(newUser.email);
        if (!emailSent) {
          this.logger.warn(`Failed to send verification email to ${newUser.email}`);
        }
        
        // Return success response with token as separate key
        this.logger.log('Signup completed successfully');
        return res.status(200).json({
          success: true,
          message: 'Signup Success.',
          data: response,
          token: token
        });
      }

    } catch (error) {
      this.logger.error('Error during signup', error);
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
      this.logger.log('Login request received', JSON.stringify(loginDto));
      
      const { emailOrUsername, password, rememberMe } = loginDto;
      
      // Find user by email or username
      let user: Users | null = null;
      
      if (emailOrUsername.includes('@')) {
        // Treat as email
        user = await this.usersService.findOneByEmail(emailOrUsername);
      } else {
        // Treat as username
        user = await this.usersRepository.findOne({
          where: { username: emailOrUsername },
          relations: ['currency']
        });
      }
      
      // If user not found or password doesn't match
      if (!user) {
        this.logger.warn(`User not found: ${emailOrUsername}`);
        return res.status(401).json(errorResponse('Invalid credentials', 401));
      }
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${emailOrUsername}`);
        return res.status(401).json(errorResponse('Invalid credentials', 401));
      }
      
      // Generate JWT token
      const token = this.usersService.generateJwtToken(user);
      
      // Update user with token
      await this.usersService.updateToken(user.id, token);
      
      // Prepare response data
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
        // Include currency details if available
        currency: user.currency ? {
          id: user.currency.id,
          name: user.currency.name,
          code: user.currency.code
        } : null
      };

      // Delete sensitive fields
      delete (response as any).password;
      delete (response as any).passwordText;
      delete (response as any).token; // Don't send the token in the user data
      
      this.logger.log('Login completed successfully', user.id);
      return res.status(200).json({
        success: true,
        message: 'Login Success.',
        data: response,
        token: token
      });
      
    } catch (error) {
      this.logger.error('Error during login', error);
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

  @Get('profile')
  async getProfile(@Req() req, @Headers('authorization') authHeader: string, @Res() res) {
    try {
      this.logger.log('Profile endpoint called');
      this.logger.log('Authorization header:', authHeader);
      
      // Extract token from Authorization header
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.warn('No valid authorization header provided');
        return res.status(401).json(errorResponse('Authorization token is required', 401));
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      this.logger.log('Extracted token:', token);

      // Verify and decode the token
      let decoded: any;
      try {
        this.logger.log('JWT_SECRET being used for verification:', USERS_CONSTANTS.JWT_SECRET);
        decoded = jwt.verify(token, USERS_CONSTANTS.JWT_SECRET);
        this.logger.log('Token decoded successfully:', decoded);
      } catch (error) {
        this.logger.error('Token verification failed:', error);
        return res.status(401).json(errorResponse('Invalid or expired token', 401));
      }

      // Find user by ID from token
      this.logger.log('Finding user by email:', decoded.email);
      const user = await this.usersService.findOneByEmail(decoded.email);
      this.logger.log('User found:', user);
      
      if (!user) {
        this.logger.warn('User not found for email:', decoded.email);
        return res.status(404).json(errorResponse('User not found', 404));
      }

      // Prepare response data
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
        // Include currency details if available
        currency: user.currency ? {
          id: user.currency.id,
          name: user.currency.name,
          code: user.currency.code
        } : null
      };

      // Delete sensitive fields
      delete (response as any).password;
      delete (response as any).passwordText;
      delete (response as any).token;

      this.logger.log('Profile response prepared:', response);
      return res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: response
      });
    } catch (error) {
      this.logger.error('Error retrieving profile', error);
      return res.status(error.status || 500).json(
        errorResponse(
          error.response?.message || error.message || 'Something went wrong',
          error.status || 500
        )
      );
    }
  }
}