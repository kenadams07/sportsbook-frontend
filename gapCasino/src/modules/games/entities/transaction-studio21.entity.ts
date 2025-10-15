import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

export enum TransactionStatus {
  OPEN = 'open',
  SETTLED = 'settled',
  ROLLBACK = 'rollback',
  CANCELLED = 'cancelled',
}

@Entity('studio21_transactions')
export class Studio21Transaction extends BaseEntity {

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  gameId: string;

  @Column({ nullable: true })
  roundId: string;

  @Column({ nullable: true })
  txnId: string;

  @Column({ nullable: true })
  reqId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stake: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pl: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prevBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  postBalance: number;

  @Column({ type: 'simple-json', nullable: true })
  currency: {
    code: string;
    value: number;
  };

  @Column({ 
    type: 'enum', 
    enum: TransactionStatus, 
    default: TransactionStatus.OPEN 
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  description: string;
}