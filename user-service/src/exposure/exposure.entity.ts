import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';
import { Markets } from '../markets/markets.entity';

@Entity()
export class Exposure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Markets)
  @JoinColumn({ name: 'marketId' })
  market: Markets;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  is_clear: string;

  @Column()
  marketType: string;

  @Column()
  exposure: string;

  @Column({ type: 'varchar', nullable: true })
  eventId: string;
}