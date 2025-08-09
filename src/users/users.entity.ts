import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { Exposure } from 'src/exposure/exposure.entity';
import { ResultTransaction } from 'src/resultTransaction/resultTransaction.entity';
import { SportBets } from 'src/sportBets/sportBets.entity';

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

  @Column({ type: 'int', default: 0 })
  role: number;

  @Column({ type: 'timestamp', nullable: true })
  emailVerify: Date;

  // Self-referencing relationship: One user can have many direct children, and each child has one direct parent
  @ManyToOne(() => Users, (user) => user.direntparent)
  @JoinColumn({ name: 'parentId' })
  parent: Users;

  @OneToMany(() => Users, (user) => user.parent, { cascade: ['remove'] })
  direntparent: Users[];

  // currencyId reference (many users to one currency)
  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @Column({ type: 'int', default: 0 })
  clientShare: number;

  @Column('simple-array', { nullable: true })
  casino: string[]; // stored as comma separated strings

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

  // SportsBets relation (assuming one-to-many)
  @OneToMany(() => SportBets, (sportsBet) => sportsBet.user)
  sportsBets: SportBets[];

  // Exposure relation
  @OneToMany(() => Exposure, (exposure) => exposure.user)
  exposure: Exposure[];

  // ResultTransaction relation
  @OneToMany(() => ResultTransaction, (resultTransaction) => resultTransaction.user)
  resultTransaction: ResultTransaction[];
}
