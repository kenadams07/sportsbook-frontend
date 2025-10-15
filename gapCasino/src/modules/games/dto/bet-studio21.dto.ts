import { Studio21BaseDto } from './base-studio21.dto';

export class Studio21BetDto extends Studio21BaseDto {
  roundId: string;
  transactionId: string;
  reqId: string;
  debitAmount: string;
  betType: string;
}