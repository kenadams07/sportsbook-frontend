import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    // Check if required SMTP configuration is available
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USERNAME');
    const smtpPass = this.configService.get<string>('SMTP_PASSWORD');
    const smtpFrom = this.configService.get<string>('SMTP_FROM_MAIL');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
      this.logger.warn('SMTP configuration is incomplete. Email functionality will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    
    // Verify transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('SMTP configuration error:', error);
      } else {
        this.logger.log('SMTP server is ready to take messages');
      }
    });
  }

  async sendOTPMail(toMailId: string, OTP: string): Promise<boolean> {
    // Check if transporter is configured
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Skipping email send.');
      return false;
    }

    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM_MAIL'),
        to: toMailId,
        subject: 'E-mail Verification OTP || Sportsbook',
        text: `Your OTP is ${OTP}. It will expire in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/image_2025_04_02T12_21_55_893Z.png" alt="Sportsbook Logo" style="max-width: 150px; height: auto;" />
              <p style="color: #555; margin-top: 8px;">Email Verification</p>
            </div>
            <div style="font-size: 16px; color: #333;">
              <p>Dear User,</p>
              <p>Thank you for registering with <strong>Sportsbook</strong>.</p>
              <p>Your One-Time Password (OTP) for email verification is:</p>
              <p style="text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2e86de;">${OTP}</p>
              <p style="margin-top: 20px;">This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
              <p>If you did not request this, please ignore this email.</p>
            </div>
            <hr style="margin: 30px 0;" />
            <div style="text-align: center; font-size: 12px; color: #888;">
              &copy; ${new Date().getFullYear()} Sportsbook. All rights reserved.
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('OTP email sent:', info.messageId);
      return true;
    } catch (error) {
      this.logger.error('Error in sendOTPMail', error);
      return false;
    }
  }

  async sendWelcomeEmail(toMailId: string, name: string): Promise<boolean> {
    // Check if transporter is configured
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Skipping email send.');
      return false;
    }

    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM_MAIL'),
        to: toMailId,
        subject: 'Welcome to Sportsbook!',
        text: `Welcome ${name} to Sportsbook!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/image_2025_04_02T12_21_55_893Z.png" alt="Sportsbook Logo" style="max-width: 150px; height: auto;" />
              <h1 style="color: #2e86de;">Welcome to Sportsbook!</h1>
            </div>
            <div style="font-size: 16px; color: #333;">
              <p>Dear ${name},</p>
              <p>Welcome to Sportsbook! We're excited to have you on board.</p>
              <p>Start exploring our wide range of sports betting options and enjoy a seamless betting experience.</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy betting!</p>
            </div>
            <hr style="margin: 30px 0;" />
            <div style="text-align: center; font-size: 12px; color: #888;">
              &copy; ${new Date().getFullYear()} Sportsbook. All rights reserved.
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Welcome email sent:', info.messageId);
      return true;
    } catch (error) {
      this.logger.error('Error in sendWelcomeEmail', error);
      return false;
    }
  }

  async sendPasswordResetEmail(toMailId: string, resetToken: string): Promise<boolean> {
    // Check if transporter is configured
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Skipping email send.');
      return false;
    }

    try {
      const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:5002')}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM_MAIL'),
        to: toMailId,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click here to reset: ${resetUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/image_2025_04_02T12_21_55_893Z.png" alt="Sportsbook Logo" style="max-width: 150px; height: auto;" />
              <h1 style="color: #2e86de;">Password Reset</h1>
            </div>
            <div style="font-size: 16px; color: #333;">
              <p>Hello,</p>
              <p>You requested a password reset. Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #2e86de; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
              </div>
              <p>If you didn't request this, please ignore this email.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
            <hr style="margin: 30px 0;" />
            <div style="text-align: center; font-size: 12px; color: #888;">
              &copy; ${new Date().getFullYear()} Sportsbook. All rights reserved.
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Password reset email sent:', info.messageId);
      return true;
    } catch (error) {
      this.logger.error('Error in sendPasswordResetEmail', error);
      return false;
    }
  }
}