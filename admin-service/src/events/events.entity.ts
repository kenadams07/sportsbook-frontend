import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Leagues } from '../leagues/leagues.entity';
import { Markets } from '../markets/markets.entity';

export enum EventStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3',
}

export enum ActualStatus {
  UPCOMING = 'upcoming',
  IN_PLAY = 'in-play',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity()
export class Events {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  eventId: string;

  @ManyToOne(() => Leagues, (league) => league.events)
  league: Leagues;

  @ManyToMany(() => Markets)
  @JoinTable({
    name: 'event_markets',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'market_id', referencedColumnName: 'id' },
  })
  markets: Markets[];

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: EventStatus,
  })
  status: EventStatus;

  @Column({
    type: 'enum',
    enum: ActualStatus,
    nullable: true,
  })
  actualStatus: ActualStatus;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}