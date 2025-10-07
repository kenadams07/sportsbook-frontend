import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  passwordText: string;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'int', default: 0 })
  role: number;

  @Column({ type: 'timestamp', nullable: true })
  emailVerify: Date;

  @Column({ unique: true, nullable: true })
  @Index()
  username: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  middlename: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ type: 'varchar', nullable: true })
  salaryLevel: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ type: 'int', default: 0 })
  clientShare: number;

  @Column('simple-array', { nullable: true })
  casino: string[];

  @Column({ type: 'int', default: 0 })
  creditReference: number;

  @Column({ type: 'int', default: 0 })
  balance: number;

  @Column({ nullable: true })
  system_ip: string;

  @Column({ nullable: true })
  browser_ip: string;

  @Column({ default: '1' })
  status: string;

  @Column({ default: true })
  betAllow: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  exposure: number;

  // Add missing fields that were in the original service but not in the entity
  @Column({ nullable: true })
  currencyId: string;

  @Column({ nullable: true })
  gap_casino_token: string;
  
  // Adding new fields for county and city
  @Column({ nullable: true })
  county: string;
  
  @Column({ nullable: true })
  city: string;
}