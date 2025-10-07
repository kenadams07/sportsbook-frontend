import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateGapCasinoDto {
  @IsOptional()
  @IsString()
  gameId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gameCode?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  providerName?: string;

  @IsOptional()
  @IsString()
  subProviderName?: string;

  @IsOptional()
  @IsString()
  urlThumb?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  token?: string;
  
  // Note: createdAt and updatedAt are automatically managed by the database
  // They correspond to your Mongoose timestamps and are inherited from BaseEntity
}