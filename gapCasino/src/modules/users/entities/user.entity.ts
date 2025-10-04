import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  username: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ default: true })
  isActive: boolean;
}