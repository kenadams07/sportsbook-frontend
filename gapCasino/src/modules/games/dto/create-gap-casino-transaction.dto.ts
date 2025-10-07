import { IsOptional, IsString, IsBoolean, IsNumber, IsEnum, IsObject } from 'class-validator';
import { TransactionStatus } from '../entities/gap-casino-transaction.entity';

export class CreateGapCasinoTransactionDto {
  @IsOptional()
  @IsString()
  userId?: string;

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
  roundId?: string;

  @IsOptional()
  @IsString()
  txnId?: string;

  @IsOptional()
  @IsString()
  reqId?: string;

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
  enabled?: boolean;

  @IsOptional()
  @IsNumber()
  stake?: number;

  @IsOptional()
  @IsNumber()
  pl?: number;

  @IsOptional()
  @IsNumber()
  prevBalance?: number;

  @IsOptional()
  @IsNumber()
  postBalance?: number;

  @IsOptional()
  @IsObject()
  currency?: any;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
  
  // Note: createdAt and updatedAt are automatically managed by the database
}