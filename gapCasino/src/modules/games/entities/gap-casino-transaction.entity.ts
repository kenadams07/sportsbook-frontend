import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../users/entities/user.entity';

export enum TransactionStatus {
  OPEN = "1",
  SETTLED = "2",
  INVALID = "3",
  VOID = "4",
  DELETE = "5",
  ROLLBACK = "9"
}

@Entity('gap_casino_transactions')
export class GapCasinoTransaction extends BaseEntity {
  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  gameId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  gameCode: string;

  @Column({ nullable: true })
  roundId: string;

  @Column({ nullable: true })
  txnId: string;

  @Column({ nullable: true })
  reqId: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  providerName: string;

  @Column({ nullable: true })
  subProviderName: string;

  @Column({ nullable: true })
  urlThumb: string;

  @Column({ nullable: true })
  enabled: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  stake: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pl: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prevBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  postBalance: number;

  @Column({ type: 'simple-json', nullable: true })
  currency: any;

  @Column({ nullable: true })
  @Index()
  description: string;

  @Column({ nullable: true })
  token: string;

  @Column({
    type: 'simple-enum',
    enum: TransactionStatus,
    nullable: true
  })
  status: TransactionStatus;
  
  // Note: createdAt and updatedAt are inherited from BaseEntity
  // They correspond to your Mongoose timestamps
}