import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class Exposure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  marketId: string;

  @Column()
  eventId: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  is_clear: string;

  @Column()
  marketType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  exposure: number;
}