import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  system_ip?: string;

  @IsString()
  @IsOptional()
  browser_ip?: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}