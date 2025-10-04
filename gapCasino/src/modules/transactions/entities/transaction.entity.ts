import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  BET = 'bet',
  WIN = 'win',
  BONUS = 'bonus',
}

@Entity('transactions')
@Index(['userId', 'createdAt'])
export class Transaction extends BaseEntity {
  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'simple-enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  balanceAfter: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  referenceId: string;
}