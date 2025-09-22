import { Events } from '../events/events.entity';
import { Runners } from '../runners/runners.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum MarketType {
  ODDS = 'ODDS',
}

export enum ExposureStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3',
}

@Entity()
export class Markets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  marketId: string;

  @Column()
  marketName: string;

  @Column({
    type: 'enum',
    enum: MarketType,
  })
  marketType: MarketType;

  @Column({
    type: 'timestamp',
  })
  marketTime: Date;

  @Column({
    type: 'enum',
    enum: ExposureStatus,
  })
  status: ExposureStatus;

  @ManyToMany(() => Events)
  @JoinTable({
    name: 'event_markets',
    joinColumn: { name: 'market_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  events: Events[];

  @ManyToMany(() => Runners)
  @JoinTable({
    name: 'market_runners',
    joinColumn: { name: 'market_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'runner_id', referencedColumnName: 'id' },
  })
  runners: Runners[];
}