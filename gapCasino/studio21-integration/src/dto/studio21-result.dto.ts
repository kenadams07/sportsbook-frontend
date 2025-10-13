import { Studio21BaseDto } from './studio21-base.dto';

export class Studio21ResultDto extends Studio21BaseDto {
  roundId: string;
  transactionId: string;
  reqId: string;
  creditAmount: string;
  betType: string;
}