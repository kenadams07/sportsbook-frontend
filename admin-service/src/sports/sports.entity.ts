import { Events } from '../events/events.entity';
import { Markets } from '../markets/markets.entity';
import { Runners } from '../runners/runners.entity';
import { SportStakeSettings } from '../sportStakeSettings/sportStakeSettings.entity';
import { Leagues } from '../leagues/leagues.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SportStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3',
}

@Entity()
export class Sports {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slugName: string;

  @Column({ type: 'varchar', length: 100 })
  sportsCode: string;

  @Column({
    type: 'enum',
    enum: SportStatus,
  })
  status: SportStatus;

  @Column({
    type: 'enum',
    enum: SportStatus,
  })
  actualStatus: SportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}