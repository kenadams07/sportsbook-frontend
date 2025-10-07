import { PartialType } from '@nestjs/mapped-types';
import { CreateGapCasinoTransactionDto } from './create-gap-casino-transaction.dto';

export class UpdateGapCasinoTransactionDto extends PartialType(CreateGapCasinoTransactionDto) {}