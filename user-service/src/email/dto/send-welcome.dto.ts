import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendWelcomeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}