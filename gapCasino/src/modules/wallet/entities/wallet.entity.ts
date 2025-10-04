import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonusBalance: number;
}