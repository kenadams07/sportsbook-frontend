import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('users')
export class User extends BaseEntity {

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ default: true })
  betAllow: boolean;

  @Column({ default: '1' })
  status: string;

  @Column({ name: 'currency_id', nullable: true })
  currencyId: string;
}