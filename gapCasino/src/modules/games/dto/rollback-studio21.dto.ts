import { Studio21BaseDto } from './base-studio21.dto';

export class Studio21RollbackDto extends Studio21BaseDto {
  roundId: string;
  transactionId: string;
  reqId: string;
  rollbackAmount: string;
  betType: string;
}