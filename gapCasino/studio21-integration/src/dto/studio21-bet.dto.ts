import { Studio21BaseDto } from './studio21-base.dto';

export class Studio21BetDto extends Studio21BaseDto {
  roundId: string;
  transactionId: string;
  reqId: string;
  debitAmount: string;
  betType: string;
}