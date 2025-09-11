import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { Users } from '../users/users.entity';
import { Markets } from '../markets/markets.entity';
import { Sports } from '../sports/sports.entity';
import { Events } from '../events/events.entity';

export enum BettingType {
  ODDS = 'ODDS',
  // Add other types if needed
}

export enum SelectionType {
  BACK = 'back',
  LAY = 'lay',
}

export enum BetStatus {
  PENDING = '1',
  WON = '2',
  LOST = '3',
  CANCELLED = '4',
  VOID = '5',
  SETTLED = '6',
  OTHER = '7', // as per provided data
}

@Entity()
export class SportBets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sports)
  sport: Sports;

  @ManyToOne(() => Events)
  event: Events;

  @ManyToOne(() => Markets)
  market: Markets;

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column({
    type: 'enum',
    enum: BettingType,
  })
  bettingType: BettingType;

  @Column({ type: 'varchar', length: 255 })
  selection: string;

  @Column({
    type: 'enum',
    enum: SelectionType,
  })
  selectionType: SelectionType;

  @Column({ type: 'varchar', length: 50 })
  selectionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  odds: number;

  @Column('decimal', { precision: 15, scale: 2 })
  stake: number;

  @Column({
    type: 'enum',
    enum: BetStatus,
  })
  status: BetStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
