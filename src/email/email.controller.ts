import { Controller, Post, Body, HttpStatus, HttpException, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { SendWelcomeDto } from './dto/send-welcome.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-otp')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<{ success: boolean; message: string }> {
    const { email, otp } = sendOtpDto;

    const result = await this.emailService.sendOTPMail(email, otp);
    
    if (result) {
      return {
        success: true,
        message: 'OTP email sent successfully',
      };
    } else {
      throw new HttpException('Failed to send OTP email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send-welcome')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendWelcome(@Body() sendWelcomeDto: SendWelcomeDto): Promise<{ success: boolean; message: string }> {
    const { email, name } = sendWelcomeDto;

    const result = await this.emailService.sendWelcomeEmail(email, name);
    
    if (result) {
      return {
        success: true,
        message: 'Welcome email sent successfully',
      };
    } else {
      throw new HttpException('Failed to send welcome email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send-password-reset')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendPasswordReset(@Body() sendPasswordResetDto: SendPasswordResetDto): Promise<{ success: boolean; message: string }> {
    const { email } = sendPasswordResetDto;
    // Generate a random token for this example
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const result = await this.emailService.sendPasswordResetEmail(email, resetToken);
    
    if (result) {
      return {
        success: true,
        message: 'Password reset email sent successfully',
      };
    } else {
      throw new HttpException('Failed to send password reset email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}