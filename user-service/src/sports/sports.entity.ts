import { Events } from 'src/events/events.entity';
import { Markets } from 'src/markets/markets.entity';
import { Runners } from 'src/runners/runners.entity';
import { SportStakeSettings } from 'src/sportStakeSettings/sportStakeSettings.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SportStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3', // extend as needed
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

  // One sport has many events
  @OneToMany(() => Events, (event) => event.sport)
  events: Events[];

  // ManyToMany relationship with markets
  @ManyToMany(() => Markets)
  @JoinTable({
    name: 'sport_markets',
    joinColumn: { name: 'sport_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'market_id', referencedColumnName: 'id' },
  })
  markets: Markets[];

  // ManyToMany relationship with runners
  @ManyToMany(() => Runners)
  @JoinTable({
    name: 'sport_runners',
    joinColumn: { name: 'sport_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'runner_id', referencedColumnName: 'id' },
  })
  runners: Runners[];

  // ManyToMany relationship with settings
  @ManyToMany(() => SportStakeSettings)
  @JoinTable({
    name: 'sport_settings',
    joinColumn: { name: 'sport_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'setting_id', referencedColumnName: 'id' },
  })
  settings: SportStakeSettings[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
