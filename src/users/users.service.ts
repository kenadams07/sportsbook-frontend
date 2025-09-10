import { Injectable, Logger, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { USERS_CONSTANTS } from './users.constants';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  async create(payload: Partial<Users>): Promise<Users> {
    const user = this.usersRepository.create(payload);
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneByEmailOrUsername(emailOrUsername: string): Promise<Users | null> {
    // Try to find by email first
    let user = await this.findOneByEmail(emailOrUsername);
    if (user) {
      return user;
    }
    
    // If not found by email, try to find by username
    user = await this.findOneByUsername(emailOrUsername);
    return user;
  }

  async validateUserCredentials(loginDto: LoginDto): Promise<Users | null> {
    const { emailOrUsername, password } = loginDto;
    
    // Find user by email or username
    const user = await this.findOneByEmailOrUsername(emailOrUsername);
    
    // If user not found, return null
    if (!user) {
      return null;
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If password is valid, return user
    if (isPasswordValid) {
      return user;
    }
    
    // If password is invalid, return null
    return null;
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

    return jwt.sign(payload, USERS_CONSTANTS.JWT_SECRET, {
      expiresIn: USERS_CONSTANTS.TOKEN_EXPIRESIN,
    } as jwt.SignOptions);
  }

  async updateToken(userId: string, token: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { token });
  }

  async generateResetToken(email: string): Promise<string | null> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      // For security reasons, we don't reveal if the email exists
      return null;
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Set token expiry (1 hour from now)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    // Save token and expiry to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await this.usersRepository.save(user);

    return resetToken;
  }

  async validateResetToken(token: string): Promise<Users | null> {
    const user = await this.usersRepository.findOne({ where: { resetToken: token } });
    
    if (!user) {
      return null;
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return null;
    }

    return user;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const { token, newPassword } = resetPasswordDto;
    
    // Validate token
    const user = await this.validateResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user password
    user.password = hashedPassword;
    user.passwordText = newPassword;
    
    // Clear reset token
    user.resetToken = null;
    user.resetTokenExpiry = null;
    
    // Save user
    await this.usersRepository.save(user);
    
    return true;
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      this.logger.log(`Sending password reset email to ${email}`);
      const result = await this.emailService.sendPasswordResetEmail(email, resetToken);
      
      if (result) {
        this.logger.log(`Password reset email sent successfully to ${email}`);
      } else {
        this.logger.warn(`Failed to send password reset email to ${email}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error sending password reset email to ${email}:`, error);
      return false;
    }
  }

  /**
   * Find user by JWT token
   * @param token JWT token
   * @returns User object without sensitive fields
   */
  async findUserByToken(token: string): Promise<Users | null> {
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, USERS_CONSTANTS.JWT_SECRET) as {
        id: string;
        email: string;
        role: number;
        name: string;
      };

      // Find user by ID from the decoded token
      const user = await this.usersRepository.findOne({
        where: { id: decoded.id },
        relations: ['currency']
      });

      if (!user) {
        return null;
      }

      // Remove sensitive fields
      delete (user as any).password;
      delete (user as any).passwordText;
      delete (user as any).token;
      delete (user as any).resetToken;
      delete (user as any).resetTokenExpiry;

      return user;
    } catch (error) {
      this.logger.error('Error verifying token:', error);
      return null;
    }
  }
}