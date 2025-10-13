import { Studio21BaseDto } from './studio21-base.dto';

export class Studio21RollbackDto extends Studio21BaseDto {
  roundId: string;
  transactionId: string;
  reqId: string;
  rollbackAmount: string;
  betType: string;
}