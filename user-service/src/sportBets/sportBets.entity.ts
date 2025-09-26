import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from 'src/currency/currency.entity';
import { Users } from 'src/users/users.entity';
import { Markets } from 'src/markets/markets.entity';
import { Sports } from 'src/sports/sports.entity';
import { Events } from 'src/events/events.entity';

export enum BettingType {
  ODDS = 'ODDS',
}

export enum SelectionType {
  BACK = 'back',
}

export enum BetStatus {
  PENDING = '1',
  WON = '2',
  LOST = '3',
  CANCELLED = '4',
  VOID = '5',
  SETTLED = '6',
  OTHER = '7',
}

@Entity()
export class SportBets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  eventId: string;

  @Column({ type: 'varchar' })
  sportId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  stake: number;

  @Column({
    type: 'enum',
    enum: SelectionType,
  })
  selectionType: SelectionType;

  @Column('decimal', { precision: 10, scale: 2 })
  odds: number;

  @Column({ type: 'varchar' })
  marketId: string;

  @Column({ type: 'varchar' })
  selection: string;

  @Column({ type: 'varchar' })
  marketType: string;

  @Column({ type: 'varchar' })
  leagueId: string;

  @Column({ type: 'varchar' })
  selectionId: string;

  @Column({ type: 'varchar' })
  marketName: string;

  @Column({
    type: 'enum',
    enum: BettingType,
  })
  bettingType: BettingType;

  @Column({
    type: 'enum',
    enum: BetStatus,
    default: BetStatus.PENDING,
  })
  status: BetStatus;

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Currency)
  currency: Currency;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}