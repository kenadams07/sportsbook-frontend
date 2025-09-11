import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { Exposure } from '../exposure/exposure.entity';
import { ResultTransaction } from '../resultTransaction/resultTransaction.entity';
import { SportBets } from '../sportBets/sportBets.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @ManyToOne(() => Users, (user) => user.direntparent)
  @JoinColumn({ name: 'parentId' })
  parent: Users;

  @OneToMany(() => Users, (user) => user.parent, { cascade: ['remove'] })
  direntparent: Users[];

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

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

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  @OneToMany(() => SportBets, (sportsBet) => sportsBet.user)
  sportsBets: SportBets[];

  @OneToMany(() => Exposure, (exposure) => exposure.user)
  exposure: Exposure[];

  @OneToMany(() => ResultTransaction, (resultTransaction) => resultTransaction.user)
  resultTransaction: ResultTransaction[];
}