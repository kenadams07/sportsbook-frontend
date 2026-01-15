import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
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
  name: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne('Users', 'direntparent', { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: 'Users';

  @OneToMany('Users', 'parent', { cascade: ['remove'] })
  direntparent: 'Users'[];

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

  @OneToMany(() => SportBets, (sportBets) => sportBets.user)
  sportsBets: SportBets[];

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  exposure: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  gap_casino_token: string;

  @OneToMany(
    () => ResultTransaction,
    (resultTransaction) => resultTransaction.user,
  )
  resultTransaction: ResultTransaction[];
}
