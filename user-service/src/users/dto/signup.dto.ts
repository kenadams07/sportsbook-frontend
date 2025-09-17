import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, Matches, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}