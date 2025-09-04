import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  emailOrUsername: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe: boolean;
}