import { IsOptional, IsString } from 'class-validator';

export class CreateGapCasinoUserTokenDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  gap_casino_token?: string;
  
  // Note: createdAt and updatedAt are automatically managed by the database
}