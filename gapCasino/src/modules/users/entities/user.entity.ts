import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ unique: true, nullable: true })
  @Index()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'int', default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  exposure: number;

  @Column({ name: 'currency_id', nullable: true })
  currencyId: string;

  @Column({ nullable: true })
  gap_casino_token: string;

  @Column({ nullable: true })
  county: string;
  
  @Column({ nullable: true })
  city: string;
  
  // Fields needed for casino operations
  @Column({ default: '1' })
  status: string;

  @Column({ default: true })
  betAllow: boolean;
}