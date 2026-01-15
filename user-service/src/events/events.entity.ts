import { Markets } from '../markets/markets.entity';
import { Sports } from '../sports/sports.entity';
import { SportStakeSettings } from '../sportStakeSettings/sportStakeSettings.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EventStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3', // extend if more statuses are used
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
  eventId: string; // original MongoDB eventId

  @ManyToOne(() => Sports)
  sport: Sports;

  @ManyToMany(() => Markets)
  @JoinTable({
    name: 'event_markets',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'market_id', referencedColumnName: 'id' },
  })
  markets: Markets[];

  @ManyToMany(() => SportStakeSettings)
  @JoinTable({
    name: 'event_settings',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'setting_id', referencedColumnName: 'id' },
  })
  settings: SportStakeSettings[];

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
